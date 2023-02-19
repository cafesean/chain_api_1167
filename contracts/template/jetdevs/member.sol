// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "../../interface/IProxy.sol";

contract TemplateContract is  
    Ownable
{
    uint256 authContractsCounter = 0;
    address public _owner;

    //template constants
    uint256 internal CLASS = 0;
    uint256 internal DESCRIPTION = 1;
    uint256 internal CLASS_URI = 2;
    uint256 internal LEVEL = 3;
    uint256 internal SKILL = 4;
    uint256 internal SKILL_URI = 5;
    uint256 internal POSITION = 6;


    uint256 internal ATTR_YEAR = 1;
    uint256 internal ATTR_LOC = 2;
    uint256 internal ATTR_STATUS = 3;
    uint256 internal ATTR_LEVEL = 4;
    uint256 internal ATTR_POS = 5;
    uint256 internal ATTR_AVAIL = 6;

    string internal logoX;
    string internal logoY;
    string internal logoColor;
    string internal logoScale;
    string internal logoOpacity;
    string internal logoBackgroundColor;
    
    struct contractAuth{
        uint256 id;
        string name;
        uint256 status;
        //can add module access later
    }

    IProxy proxy;

    mapping(address => contractAuth) public authorizedContracts;


    constructor(string memory _name) {
        _owner = _msgSender();


    }


    function getAttributeString(uint256 _tokenId) public view returns (string memory) {
        IProxy _proxyContract = IProxy(_msgSender());
        
        string memory _attributeString;
        string memory _value;
        for (uint256 i = 1; i <= _proxyContract.getAttributeCount(); i++) {
            require(_proxyContract._attributes(i).visible != false);// && bytes(userAttributes[_tokenId][_id]).length != 0);
            if (keccak256(abi.encodePacked(_proxyContract._userAttributes(_tokenId, i))) != keccak256(abi.encodePacked(""))) {
                _value = _proxyContract._userAttributes(_tokenId, i); 
                if (bytes(_value).length != 0) {
                    _attributeString = string.concat(
                        _attributeString,
                        '{',
                        '"trait_type": "', _proxyContract._attributes(i).name ,'",',
                        '"value": "', _proxyContract._userAttributes(_tokenId, i), '"',
                        '},'
                    );                
                }
            }  
        }
        return _attributeString;
    }
    
    function generateUri(uint256 _tokenId) public view returns (string memory){
console.log("IProxy sender: ", _msgSender());
        IProxy _proxyContract = IProxy(_msgSender());
console.log("IProxy 1: ", _msgSender());
        bytes memory dataURI;
console.log("Class Id: ", _proxyContract._users(_tokenId).classId);
        if (_proxyContract._users(_tokenId).classId == 0) {
            dataURI = abi.encodePacked(
                '{',
                    '"name": "",',
                    '"description": "",',
                    '"image": "",',
                    '"animation_url": ""',
                '}'
            );   
        } else {
    
console.log("generateUri: after else");
            string memory attributeString;

console.log("generateUri: 2");
            uint256 _classId = _proxyContract._users(_tokenId).classId;
            string[7] memory _uriData;

console.log("generateUri: 3");
            _uriData[CLASS] = _proxyContract._classes(_proxyContract._users(_tokenId).classId).name;
            _uriData[DESCRIPTION] = _proxyContract._classes(_proxyContract._users(_tokenId).classId).description;
            _uriData[CLASS_URI] = _proxyContract._classes(_classId).classUri;
            _uriData[SKILL] = _proxyContract._skills(_proxyContract._users(_tokenId).skillId).name;
            _uriData[SKILL_URI] = _proxyContract._skills(_proxyContract._users(_tokenId).skillId).skillUri;
            _uriData[POSITION] = _proxyContract._userAttributes(_tokenId, ATTR_POS);     
            if (bytes(_proxyContract._userAttributes(_tokenId, ATTR_LEVEL)).length != 0) {
                _uriData[LEVEL] = string.concat("Level ", _proxyContract._userAttributes(_tokenId, ATTR_LEVEL));
            }    
            string memory _svgBasic = _proxyContract._classes(_classId).classUri;
            string memory _svgFull = generateSVGFull(_uriData);

            attributeString = string.concat(
                '"attributes":[',
                getAttributeString(_tokenId),
                '{}', //hack for no comma
                '],'
            );
            
            dataURI = abi.encodePacked(
                '{',
                    '"name": "', _uriData[CLASS], '",',
                    '"description": "', _uriData[DESCRIPTION], '",',
                    '"image": "', _svgBasic, '",',
                    attributeString,
                    '"animation_url": "', _svgFull, '"',
                '}'
            );
        }  
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }


    function generateSVGFull(string[7] memory _uriData) public view returns (string memory){   
        string memory _classUri = _uriData[CLASS_URI];
        string memory _level = _uriData[LEVEL];
        string memory _skillUri = _uriData[SKILL_URI];
        string memory _role = _uriData[POSITION];
        string memory svgString = string.concat(

            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
                '<style>.base { font-family: futura; font-weight:bold; font-size: 14px; filter: drop-shadow(1px 1px 2px rgb(255 255 255 / 0.5)); } </style>',
            '<defs>',
                '<filter id="shadow">',
                '<feDropShadow dx="0.8" dy="0.8" stdDeviation="1.3" flood-color="#222222" flood-opacity="0.5" />',
                '</filter>',
                '<pattern id="skill" x="20px" y="20px" patternUnits="userSpaceOnUse" height="20px" width="20px" >',
                '<image x="0px" y="0px" height="20px" width="20px" href="', _skillUri, '"></image>',
                '</pattern>',
            '</defs>',
            '<rect cx="0" cy="0" height="350px" width="350px" style="fill:black;"/>',
            '<image x="50" y="50" height="250px" width="250px" href="', _classUri, '"></image>',
            '<image x="-35px" y="240px" height="100px" width="100px" href="https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/class/jd-blue.svg"></image>',
            '<circle cx="30px" cy="30px" r="10px" style="fill:white; filter:url(#shadow);"/>',
            '<circle cx="30px" cy="30px" r="10px" fill="url(#skill)"/>',
            '<text x="20px" y="298px" class="base" fill="white" dominant-baseline="middle" text-anchor="start" style="font-size: 22px; ">', _level, '</text>',
            '<text x="20px" y="320px" class="base" fill="#BBBBBB" dominant-baseline="middle" text-anchor="start" style="text-transform: uppercase; ">', _role, '</text>',
             '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(abi.encodePacked(svgString))
            )
        );
    }

    function generateSVGBasic(string[7] memory _uriData) public view returns (string memory){   
        string memory _classUri = _uriData[CLASS_URI];
        string memory _level = _uriData[LEVEL];
        string memory _skillUri = _uriData[SKILL_URI];
        string memory _role = _uriData[POSITION];
    
        string memory svgString = string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
                '<style>.base { font-family: futura; font-weight:bold; font-size: 14px; } </style>',

            '<rect cx="0" cy="0" height="350px" width="350px" style="fill:black;"/>',   
            '<image x="50" y="50" height="250px" width="250px" href="', _classUri, '"></image>',
            '<text x="20px" y="298px" class="base" fill="white" dominant-baseline="middle" text-anchor="start" style="font-size: 22px; ">Level ', _level, '</text>',
            '<text x="20px" y="320px" class="base" fill="#BBBBBB" dominant-baseline="middle" text-anchor="start" style="text-transform: uppercase; ">', _role, '</text>',
             '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(abi.encodePacked(svgString))
            )
        );
    }
    function setStyles(string[] memory _styles) public {
        logoX = _styles[0];
        logoY = _styles[1];
        logoColor = _styles[2];
        logoScale = _styles[3];
        logoOpacity = _styles[4];
        logoBackgroundColor = _styles[5];
    }
    function authorizeCallingContract(address _remoteContractOwner, address _remoteContactAddress) external returns (bool) {
        //check for same owner
        require(_owner == _remoteContractOwner);
        authContractsCounter += authContractsCounter;
        authorizedContracts[_remoteContactAddress].id = authContractsCounter;

        
        return true;
    }

    function deauthorizeCallingContract(address _remoteContactAddress) external returns (bool) {
        //check for same owner
        delete authorizedContracts[_remoteContactAddress];
        return true;
    }

}


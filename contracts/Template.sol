// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "../Access.sol";
import "./interface/IProxy.sol";
import "hardhat/console.sol";

contract TemplateContract is Ownable {
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

    string public logo =
        string.concat(
            '<clipPath id="arrow" transform="scale(0.0026178,0.002)" clipPathUnits="objectBoundingBox">',
            '<path d="M 35.216 496.285 L 379.591 12.628 C 380.45 11.248 380.85 9.634 380.744 8.01 C 380.639 6.391 380.029 4.839 378.998 3.586 C 377.972 2.327 376.575 1.429 375.011 1.007 C 373.448 0.592 ',
            "371.79 0.675 370.271 1.251 L 4.932 168.693 C 3.507 169.353 2.315 170.434 1.512 171.792 C 0.713 173.145 0.347 174.714 0.453 176.289 C 0.563 177.858 1.146 179.36 2.127 180.591 C 3.108 181.828 ",
            "4.439 182.726 5.941 183.186 L 107.46 213.226 C 108.458 213.519 109.395 214.013 110.199 214.678 C 111.003 215.344 111.668 216.17 112.15 217.101 C 112.627 218.027 112.916 219.047 112.988 220.095 ",
            "C 113.065 221.137 112.927 222.185 112.588 223.178 L 21.627 489.415 C 21 491.178 21.033 493.113 21.721 494.854 C 22.403 496.595 23.7 498.026 25.358 498.885 C 27.016 499.745 28.934 499.966 30.747 ",
            '499.517 C 32.555 499.068 34.146 497.97 35.216 496.435" />',
            '<path d="M 381.803 138.498 L 354.031 418.968 C 353.882 420.548 353.25 422.04 352.229 423.254 C 351.209 424.462 349.84 425.333 348.315 425.743 C 346.785 426.148 345.166 426.081 343.68 425.538 ',
            "C 342.194 425 340.908 424.019 339.993 422.722 L 254.237 301.432 C 253.306 300.123 252.807 298.554 252.807 296.946 C 252.807 295.338 253.306 293.769 254.237 292.461 L 367.654 133.203 C 368.652 ",
            '131.817 370.071 130.797 371.707 130.303 C 373.337 129.81 375.083 129.871 376.675 130.475 C 378.272 131.074 379.619 132.188 380.523 133.641 C 381.421 135.088 381.82 136.796 381.654 138.498"/>',
            "</clipPath>"
        );

    struct contractAuth {
        uint256 id;
        string name;
        uint256 status;
        //can add module access later
    }

    IProxy proxy;

    mapping(address => contractAuth) public authorizedContracts;

    constructor() {
        _owner = _msgSender();
    }

    function getAttributeString(
        uint256 _tokenId
    ) internal view returns (string memory) {
        IProxy _proxyContract = IProxy(_msgSender());

        string memory _attributeString;
        string memory _value;
        for (uint256 i = 1; i <= _proxyContract.getAttributeCount(); i++) {
            require(_proxyContract._attributes(i).visible != false); // && bytes(userAttributes[_tokenId][_id]).length != 0);
            if (
                keccak256(
                    abi.encodePacked(
                        _proxyContract._userAttributes(_tokenId, i)
                    )
                ) != keccak256(abi.encodePacked(""))
            ) {
                _value = _proxyContract._userAttributes(_tokenId, i);
                if (bytes(_value).length != 0) {
                    _attributeString = string.concat(
                        _attributeString,
                        "{",
                        '"trait_type": "',
                        _proxyContract._attributes(i).name,
                        '",',
                        '"value": "',
                        _proxyContract._userAttributes(_tokenId, i),
                        '"',
                        "},"
                    );
                }
            }
        }
        return _attributeString;
    }

    function generateUri(uint256 _tokenId) public view returns (string memory) {
        console.log("In generateURI");
        console.log("msg.sender: %s", _msgSender());
        bytes memory dataURI;

        dataURI = abi.encodePacked(
            "{",
            '"name": "",',
            '"description": "",',
            '"image": "",',
            '"animation_url": ""',
            "}"
        );
    }

    function authorizeCallingContract(
        address _remoteContractOwner,
        address _remoteContactAddress
    ) external returns (bool) {
        //check for same owner
        require(_owner == _remoteContractOwner);
        authContractsCounter += authContractsCounter;
        authorizedContracts[_remoteContactAddress].id = authContractsCounter;

        return true;
    }

    function deauthorizeCallingContract(
        address _remoteContactAddress
    ) external returns (bool) {
        //check for same owner
        delete authorizedContracts[_remoteContactAddress];
        return true;
    }
}

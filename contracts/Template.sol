// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IProxy.sol";
import "hardhat/console.sol";

contract TemplateContract is Ownable {
    uint256 authContractsCounter = 0;
    address public _owner;

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

    function generateUri(
        uint256 _tokenId,
        string memory _baseUri
    ) public view returns (string memory) {
        console.log("In generateURI");
        bytes memory dataURI;
        string memory proxyAddress = Strings.toHexString(
            uint160(_msgSender()),
            20
        );
        dataURI = abi.encodePacked(
            string.concat(
                _baseUri,
                "/",
                proxyAddress,
                "/",
                Strings.toString(_tokenId)
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
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

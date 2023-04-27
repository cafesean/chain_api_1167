// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Access.sol";
import "./interface/IProxy.sol";

import "hardhat/console.sol";

contract ProxyFactory is OwnableUpgradeable, Access {
    bool public initialized;
    address public _owner;

    event ProxyCloned(address cloneAddress);

    modifier OnlyOwner() {
        require(_msgSender() == _owner, "Only the owner can clone a store");
        _;
    }

    function initialize() public initializer {
        // __Ownable_init();
        _owner = _msgSender();
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(ADMIN_ROLE, _owner);
        _setupRole(OPS_ROLE, _owner);
        _setupRole(SYS_ROLE, _owner);
    }

    function cloneProxy(address _impl, string memory _uuid) public onlyAdmin returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(_uuid));
        address cloneAddress = Clones.cloneDeterministic(_impl, salt);

        IProxy(_impl)
            .registerClone(_uuid, cloneAddress);    

        emit ProxyCloned(cloneAddress);

        console.log("cloneAddress: %s", cloneAddress);

        console.log("owner of this: %s", this.owner());
        return cloneAddress;
    }
}

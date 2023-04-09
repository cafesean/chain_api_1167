// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Access.sol";

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
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(ADMIN_ROLE, _owner);
        _setupRole(OPS_ROLE, _owner);
        _setupRole(SYS_ROLE, _owner);
    }

    function cloneProxy(address _impl, bytes32 _salt) public onlyAdmin returns (address) {
        address cloneAddress = Clones.cloneDeterministic(_impl, _salt);

        emit ProxyCloned(cloneAddress);

        console.log("cloneAddress: %s", cloneAddress);

        console.log("owner of this: %s", this.owner());
        return cloneAddress;
    }
}

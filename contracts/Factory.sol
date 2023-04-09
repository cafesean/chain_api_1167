// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Proxy.sol";

contract ProxyFactory {
    address public owner;
    bool public initialized;

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only the owner can clone a store");
        _;
    }

    function initialize() public OnlyOwner {
        require(!initialized, "Already init");
        owner = msg.sender;

        initialized = true;
    }

    function cloneProxy(address _impl, bytes32 _salt) public OnlyOwner {
        Clones.cloneDeterministic(_impl, _salt);
    }
}

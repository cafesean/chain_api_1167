// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Access is AccessControl {
    bytes32 internal constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 internal constant SYS_ROLE = keccak256("SYS_ROLE");
    bytes32 internal constant OPS_ROLE = keccak256("OPS_ROLE");
    string internal constant RETURN_SUCCESS = "Success";
    string internal constant RETURN_FAIL = "Fail";

    modifier onlyAdmin { //admins
        bool hasAccess = (
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender)||
            hasRole(ADMIN_ROLE, msg.sender)
            );
        require(hasAccess,"No permissions");
    _;}

    modifier onlySys { //admins + sys
        bool hasAccess = (
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender)|| 
            hasRole(ADMIN_ROLE, msg.sender)|| 
            hasRole(SYS_ROLE, msg.sender)
            );
        require(hasAccess,"No permissions");
    _; }

    modifier onlyOps { //admins + ops
        bool hasAccess = (
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender)||
            hasRole(ADMIN_ROLE, msg.sender)||
            hasRole(OPS_ROLE, msg.sender)
            );
        require(hasAccess,"No permissions");
    _;}

    modifier onlyTeam { //all team members
        bool hasAccess = (
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender)||
            hasRole(ADMIN_ROLE, msg.sender)||
            hasRole(SYS_ROLE, msg.sender)||
            hasRole(OPS_ROLE, msg.sender)
            );
        require(hasAccess,"No permissions");
    _;}

    modifier nonZero (uint x) {
        require (x != 0);
        _;
    }

    function grantAccess(address _user, string memory _role) public returns (string memory) {
        bytes32 targetRole = keccak256(abi.encodePacked(_role));
        require(
            targetRole == ADMIN_ROLE ||
            targetRole == SYS_ROLE ||
            targetRole == OPS_ROLE,
            "Invalid role"
        );
        grantRole(targetRole, _user);
        return RETURN_SUCCESS;
    }

   function removeAccess(address _user, address _owner, string memory _role) public returns (string memory) {
        require(_user != _owner,"Can't change owner role");
        bytes32 targetRole = keccak256(abi.encodePacked(_role));
        require(
            targetRole == ADMIN_ROLE ||
            targetRole == SYS_ROLE ||
            targetRole == OPS_ROLE,
            "Invalid role"
        );
        revokeRole(targetRole, _user);
        return RETURN_SUCCESS;
    }
}
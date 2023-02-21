// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Base.sol";
import "./Access.sol";
// import "hardhat/console.sol";


contract DelegateContract is
    Access,
    Base
{
     using Counters for Counters.Counter;
    Counters.Counter classesCount;    
    Counters.Counter tokenCount;
    Counters.Counter attributeCount;
    Counters.Counter skillCount;
    // uint256 public tokenCount;
    // uint256 public classesCount;
    // uint256 public attributeCount;
    // uint256 public skillCount;

    //use format: https://somedomain.com/{id}.json
    constructor(string memory _name) Base (_name)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(ADMIN_ROLE, _owner);
        _setupRole(OPS_ROLE, _owner);
        _setupRole(SYS_ROLE, _owner);
    }


    function setClass (
        uint256 _classId,
        string memory _name,
        string memory _description,
        string memory _baseUri,
        address _templateAddress
    ) public onlyOps {
        if (classes[_classId].id == 0) {
            classes[_classId].id = _classId;
        }
        if (keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("delete"))) {
            delete classes[_classId];
        } else {
            classes[_classId].name = _name;
            classes[_classId].description = _description;
            bytes(_baseUri).length != 0 ? classes[_classId].classUri = _baseUri : "" ;
           
            classes[_classId].templateAddress = 
                _templateAddress != address(0x0) ? _templateAddress : DefaultTemplate;
        }
    }

    function setSkill(
        uint256 _id,
        string memory _code,
        string memory _name,
        string memory _skillUri
    ) public onlyOps returns (uint256) {
        if (skills[_id].id == 0) {
            skills[_id].id = _id;
        }
         if (keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked("delete"))) {
            delete skills[_id];
            return 0;
        } else {
            skills[_id].code = _code;
            skills[_id].name = _name;
            bytes(_skillUri).length != 0 ? skills[_id].skillUri = _skillUri : "" ;
            return _id;
        }
    }


    function setAttribute(
        uint256 _id,
        string memory _name,
        string memory _code
    ) public onlyOps {
        if (attributes[_id].id == 0) {
            attributes[_id].id = _id;
        }
        if (keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked("delete"))) {
            delete attributes[_id];
        } else 
            if (keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked("false"))) {
                attributes[_id].visible = false; //must pre-set bools
            } else {
                attributes[_id].name = _name;
                attributes[_id].code = _code;
                attributes[_id].visible = true; //must pre-set bools
                attributes[_id].active = true; //must pre-set bools
        }
    }      
    
    function setUserAttributes(
        uint256 _tokenId,
        uint256[] calldata _skillIds,
        uint256[] calldata _skillScores,
        uint256[] calldata _attributeIds,
        string[] calldata _attributeValues
    ) public onlyOps {
        //attribs
        for (uint256 _a = 0; _a < _attributeIds.length; _a++) {
            userAttributes[_tokenId][_attributeIds[_a]] = _attributeValues[_a];
            // bytes(_attributeValues[_a]).length != 0 ? userAttributes[_tokenId][_attributeIds[_a]] = _attributeValues[_a] :
            //     bytes(userAttributes[_tokenId][_attributeIds[_a]]).length == 0 ? userAttributes[_tokenId][_attributeIds[_a]] = "" : "";
        }
        //skills
        for (uint256 _s = 0; _s < _skillIds.length; _s++) {
            _s == 0 ? users[_tokenId].skillId = _skillIds[_s] : 0; //set first skill as user's primary skill
            
            userSkills[_tokenId][_skillIds[_s]] = _skillScores[_s];
        }
    }

    function burnBatchByClass(uint256 _classId) public onlyAdmin {
        for (uint256 _userId = 1; _userId <= tokenCount.current(); _userId++) {
            require(users[_userId].classId == _classId);
            require(balanceOf(users[_userId].account, users[_userId].id) > 0, "Nothing to burn");
                _burn(users[_userId].account, users[_userId].id, 1);
        }
    }
    
    function destroy() public onlyAdmin {
        selfdestruct(payable(_owner));
    }

    //need to override to avoid conflicting instances of supportsInterface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(Base, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}


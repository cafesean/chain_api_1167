// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Access.sol";
import "./Base.sol";
import "./interface/ITemplate.sol";
import "./interface/IDelegate.sol";

import "hardhat/console.sol";

contract ProxyContract is Access, Base {
    using Counters for Counters.Counter;
    Counters.Counter classesCount;
    Counters.Counter tokenCount;
    Counters.Counter attributeCount;
    Counters.Counter skillCount;
    bool initialized = false;

    function initialize(string memory _name, string memory _uri) public initializer {
        Base.initializeBase();
        __ERC1155_init(_uri);
        __Ownable_init();
        name = _name;
        _owner = _msgSender();

        ATTR_YEAR = 1;
        ATTR_LOC = 2;
        ATTR_STATUS = 3;
        ATTR_LEVEL = 4;
        ATTR_POS = 5;
        ATTR_AVAIL = 6;
        // ATTR_STATUS = 1;
        // ATTR_ORG = 2;
        // ATTR_classes = 3;
        // ATTR_XP = 4;
        // ATTR_DATE = 5;
        // ATTR_URL = 6;
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(ADMIN_ROLE, _owner);
        _setupRole(OPS_ROLE, _owner);
    }

    //see if this forces refresh on all classesURI
    function _setClass(
        uint256 _classId,
        string calldata _name,
        string calldata _description,
        string calldata _baseUri,
        address _templateAddress
    ) public onlyOps returns (uint256 id) {
        console.log("In _setClass");
        if (_classId == 0) {
            classesCount.increment();
            _classId = classesCount.current();
            emit ClassCreated(_name, _classId);
        }
        (bool success, ) = DelegateAddress.delegatecall(
            abi.encodeWithSelector(
                IDelegate.setClass.selector,
                _classId,
                _name,
                _description,
                _baseUri,
                _templateAddress
            )
        );

        console.log("new _classId", _classId);
        return _classId;
    }

    function _setSkill(
        uint256 _skillId,
        string memory _code,
        string memory _name,
        string memory _skillUri
    ) public onlyOps returns (uint256 id) {
        if (_skillId == 0) {
            skillCount.increment();
            _skillId = skillCount.current();
            emit SkillCreated(_name, _skillId);
        }
        (bool success, ) = DelegateAddress.delegatecall(
            abi.encodeWithSelector(
                IDelegate.setSkill.selector,
                _skillId,
                _code,
                _name,
                _skillUri
            )
        );
        return _skillId;
    }

    function _setAttribute(
        uint256 _attributeId,
        string memory _name,
        string memory _code
    ) public onlyOps returns (uint256 id) {
        if (_attributeId == 0) {
            attributeCount.increment();
            _attributeId = attributeCount.current();
            emit AttributeCreated(_name, _attributeId);
        }
        (bool success, ) = DelegateAddress.delegatecall(
            abi.encodeWithSelector(
                IDelegate.setAttribute.selector,
                _attributeId,
                _name,
                _code
            )
        );
        return _attributeId;
    }

    function setAttributes(
        uint256 _tokenId,
        uint256[] memory _skillIds,
        uint256[] memory _skillScores,
        uint256[] memory _attributeIds,
        string[] memory _attributeValues
    ) public onlyOps {
        (bool success, ) = DelegateAddress.delegatecall(
            abi.encodeWithSelector(
                IDelegate.setUserAttributes.selector,
                _tokenId,
                _skillIds,
                _skillScores,
                _attributeIds,
                _attributeValues
            )
        );
        tokenURI[_tokenId] = uri(_tokenId);
        emit URI(tokenURI[_tokenId], _tokenId);
    }

    //required by opensea
    function uri(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        address _templateAddress = classes[users[_tokenId].classId]
            .templateAddress;
console.log("In uri: _tokenId = %s", _tokenId);
console.log("In uri: _templateAddress = %s", _templateAddress);
console.log("DefaultTemplate = %s", DefaultTemplate);
        return
            ITemplateContract(
                _templateAddress == address(0x0)
                    ? DefaultTemplate
                    : _templateAddress
            ).generateUri(_tokenId); //send 0 if classId is 0
    }

    // Operator mint NFT function
    function mint(
        uint256 _classId,
        address _to,
        uint256[] memory _skillIds,
        uint256[] memory _skillScores,
        uint256[] memory _attributeIds,
        string[] memory _attributeValues
    ) public onlyOps returns (uint256 id) {
        uint256 _tokenId;
        tokenCount.increment();
        console.log("Before mintSingle _classId: %s", _classId);
        console.log("Before mintSingle tokenCount: %s", tokenCount.current());
        _tokenId = mintSingle(_to, tokenCount.current(), _classId);

        console.log("After mintSingle _tokenId: %s", _tokenId);
        emit TokenCreated(_to, _tokenId);
        //set empty attributes and skills
        setAttributes(
            tokenCount.current(),
            _skillIds,
            _skillScores,
            _attributeIds,
            _attributeValues
        );
        return _tokenId;
        //_mint will automatically emit uri
    }

    function mintBatchForClasses(
        address[] memory _to,
        uint256 _classId
    ) public onlyOps {
        for (uint256 i = 0; i < _to.length; i++) {
            tokenCount.increment();
            mintSingle(_to[i], tokenCount.current(), _classId);
        }
    }

    // Interface getters
    function getAttributeCount() public view returns (uint256) {
        return attributeCount.current();
    }

    function _attributes(uint256 _id) public view returns (attribute memory) {
        return attributes[_id];
    }

    function _users(uint256 _id) public view onlyOps returns (user memory) {
        return users[_id];
    }

    function _skills(uint256 _id) public view returns (skill memory) {
        return skills[_id];
    }

    function _classes(uint256 _id) public view returns (class memory) {
        return classes[_id];
    }

    function _userAttributes(
        uint256 _tokenId,
        uint256 _attributeId
    ) public view onlyOps returns (string memory) {
        return userAttributes[_tokenId][_attributeId];
    }

    function _userSkills(
        uint256 _tokenId,
        uint256 _skillId
    ) public view onlyOps returns (string memory) {
        return userAttributes[_tokenId][_skillId];
    }

    function setDelegateAddress(address _address) public onlyAdmin {
        DelegateAddress = _address;
    }

    function setDefaultTemplate(address _address) public onlyAdmin {
        DefaultTemplate = _address;

        console.log("DefaultTemplate: %s", DefaultTemplate);
        console.log("This address: %s", address(this));
    }

    function getDefaultTemplate() public view returns (address) {

        console.log("DefaultTemplate: %s", DefaultTemplate);
        return DefaultTemplate;
    }

    function setTemplateContract(
        uint256 _classId,
        address _address
    ) public onlyOps returns (bool) {
        require(_address != address(0x0));
        classes[_classId].templateAddress = _address;

        //Request template contract to add this contract
        ITemplateContract(classes[_classId].templateAddress)
            .authorizeCallingContract(_msgSender(), address(this));

        console.log("setTemplateContract: %s", _address);
        return true;
    }

    function registerFactory(address _address) public onlyAdmin {
        _setupRole(ADMIN_ROLE, _address);
    }

    function registerClone(string memory uuid, address _clone) public onlyAdmin {
        clones[uuid] = _clone;
        _setupRole(OPS_ROLE, _clone);
    }

    function deregisterClone(string memory uuid) public onlyAdmin {
        _revokeRole(OPS_ROLE, clones[uuid]);
        delete clones[uuid];
    }

    function _setStyles(
        uint256 _classId,
        string[] memory _styles
    ) public onlyOps {
        //Request template contract to add this contract
        ITemplateContract(classes[_classId].templateAddress).setStyles(_styles);
    }

    //need to override to avoid conflicting instances of supportsInterface
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControlUpgradeable, Base) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

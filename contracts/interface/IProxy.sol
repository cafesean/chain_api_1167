// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IProxy {
    struct attribute {
        uint256 id;
        string code;
        string name;
        bool visible;
        bool active;
    }
    struct user {
        uint256 id;
        uint256 classId;
        uint256 skillId;
        uint256 previousId;
        address account;
        string url;
    }

    struct skill {
        uint256 id;
        string code; //uppercase, one word
        string name;
        string skillUri;
    }

    struct class {
        uint256 id;
        uint256 minted;
        string name;
        string description;
        string classUri;
        address templateAddress;
        // ITemplateContract templateContract;
    }
    function getAttributeCount() external view returns (uint256);
    function _attributes(uint256 _tokenId) external view returns (attribute calldata);
    function _users(uint256 _tokenId) external view returns (user calldata);
    function _skills(uint256 _tokenId) external view returns (skill calldata);
    function _classes(uint256 _tokenId) external view returns (class calldata);
    function _userAttributes(uint256 _tokenId, uint256 _attributeId) external view returns (string memory);
    function _userSkills(uint256 _tokenId, uint256 _skillId) external view returns (string memory);
    function _setSkill (uint256 _skillId, string memory _code, string memory _name, string memory _skillUri) external;
    function _setAttribute (uint256 _id, string memory _name, string memory _code) external;
    function _setClass (uint256 _classId, string calldata _name, string calldata _description, string calldata _baseUri, address _templateAddress) external;
    // function _setStyles(uint256 _classId, string[6] memory _styles) external;
    function transferOwnership(address _address) external;
}
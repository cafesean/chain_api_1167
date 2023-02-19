// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../Base.sol";
import "../Access.sol";
// import "./interface/IProxy.sol";
// import "hardhat/console.sol";



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
    function _attributes(uint256 _tokenId) external view returns (attribute memory);
    function _users(uint256 _tokenId) external view returns (user memory);
    function _skills(uint256 _tokenId) external view returns (skill memory);
    function _classes(uint256 _tokenId) external view returns (class memory);
    function _userAttributes(uint256 _tokenId, uint256 _attributeId) external view returns (string memory);
    function _userSkills(uint256 _tokenId, uint256 _skillId) external view returns (string memory);
    function _setSkill (uint256 _skillId, string memory _code, string memory _name, string memory _skillUri) external;
    function _setAttribute (uint256 _id, string memory _name, string memory _code) external;
    function _setClass (uint256 _classId, string memory _name, string memory _description, string memory _baseUri, address _templateAddress) external;
    function transferOwnership(address _address) external;
}

interface ITargetProxy {
    // function mintSingle (address _to, uint256 _tokenId, uint256 _classId) external;
    function mintBatchForClass(address[] memory _to, uint256 _classId, uint256[] memory _previousTokenIds) external;
}

contract Migrate is
    Access,
    Base
{
    // using Counters for Counters.Counter;
    // Counters.Counter tokenCount;
    // Counters.Counter classCount;
    // Counters.Counter attributeCount;
    // Counters.Counter skillCount;
    // Counters.Counter roleCount;


    IProxy proxy;

    constructor(address _proxyAddress) Base ("")
    {

    }

    function load(address _proxyAddress) public {
        proxy = IProxy(_proxyAddress);
        addClass("Member", "Member of the community.", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/level/drippy-spheres.gif");
        addClass("Certified Level 1", "Level 1 Certified Member of the community.", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/level/atomic-storm.gif");
        addClass("Certified Level 2", "Level 2 Certified Member of the community.", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/level/atomic-rainbow.gif");
    
        addSkill("GOLANG", "Golang", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-golang.png");
        addSkill("JAVA", "Java", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-java.png");
        addSkill("NODEJS", "NodeJS", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-nodejs.png");
        addSkill("REACTJS", "ReactJS", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-reactjs.png");
        addSkill("IOS", "iOS", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-ios.png");
        addSkill("ANDROID", "Android", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-android.png");
        addSkill("PHP", "PHP", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-php.png");
        addSkill("FLUTTER", "Flutter", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-flutter.png");

        addAttribute("Member Since","year");    
        addAttribute("Location","loc");         
        addAttribute("Status","status");        
        addAttribute("Level","level");          
        addAttribute("Position","pos");         
        addAttribute("Availability","avail");  
    console.log("Load done");
    }

    function transferToAssignee(address _assigneeAddress) public {
        proxy.transferOwnership(_assigneeAddress);
    }

    function addClass(string memory _name, string memory _description, string memory _classUri) public {
        proxy._setClass(0, _name, _description, _classUri, address(0x0));
    }

    function addSkill(string memory _code, string memory _name, string memory _skillUri) public {
        proxy._setSkill(0, _code, _name, _skillUri);
    }

    function addAttribute(string memory _name, string memory _code) public {
        proxy._setAttribute(0, _name, _code);
    }

    function migrateMintById(uint256[] memory _ids, uint256 _toClassId, address _toContract) internal {
        ITargetProxy _migrateContract;
        _migrateContract = ITargetProxy(_toContract);
        address[] memory _toAccounts;

        for (uint256 i = 0; i < _ids.length; i++) {
            _toAccounts[i] = proxy._users(_ids[i]).account;
        }        
        _migrateContract.mintBatchForClass(_toAccounts, _toClassId, _ids);
        burnBatchById(_ids);
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



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/utils/Base64.sol";
import "./interface/ITemplate.sol";
import "./Access.sol";
import "hardhat/console.sol";

contract Base is
    ERC1155,
    ERC1155Supply,
    ERC1155Burnable,
    Ownable,
    Access
{
    using Strings for uint256;
    address public _owner;

    struct class {
        uint256 id;
        uint256 minted;
        string name;
        string description;
        string classUri;
        address templateAddress;
    }

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


    //event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ClassURI(string classUri, uint256 indexed classId);
    event TokenCreated(uint256);
    event ClassCreated(uint256);
    event SkillCreated(uint256);
    event AttributeCreated(uint256);

    string public name;
    string public description;
    string public symbol;
    string public baseURI;
    address public DelegateAddress; 
    address public DefaultTemplate;

    //address private _owner;
    uint8 ATTR_STATUS;
    uint8 ATTR_LEVEL;
    uint8 ATTR_POS;
    uint8 ATTR_LOC;
    uint8 ATTR_YEAR;
    uint8 ATTR_AVAIL;

    mapping(address => address) public relay; //calling address => delegate address
    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => string) public classURI;
    mapping(uint256 => string) public roles;
    mapping(uint256 => user) public users;
    mapping(uint256 => class) public classes;
    mapping(uint256 => attribute) public attributes;
    mapping(uint256 => skill) public skills;
    mapping(uint256 => mapping(uint256 => string)) public userAttributes; //user => (attributeID => value)
    mapping(uint256 => mapping(uint256 => uint256)) public userSkills; //user => (skill => rating)
    
    constructor(string memory _name) ERC1155 ("https://gateway.pinata.cloud/ipfs/QmSir1V4yC9wE3XDspjw1jPdRSx6FLGLfcsKuZxj11XsEZ/default.json") {
    }

    // function owner() public view returns (address) {
    //     return _owner;
    // }

    function setOwner(address _newOwner) public onlyOwner {
        require(msg.sender == _owner, "Not the owner");
        _owner = _newOwner;
    }
    
    function _checkOwner() virtual override internal view  {
        require(msg.sender == _owner, "Not the owner");
    }

    // Initial address for contract metadata
    function contractURI() external view returns (string memory) {
        return string(abi.encodePacked(baseURI, "contract.json"));
    }
    
    function updateUsersClass(uint256[] memory _ids, uint256 _newClassId) public onlyOps {       
        for (uint256 i = 0; i < _ids.length; i++) {
            users[_ids[i]].classId = _newClassId;
            tokenURI[_ids[i]] = uri(_ids[i]);
            emit URI(tokenURI[_ids[i]], _ids[i]);
        } 
        _setURI("n");
    }

    function mintSingle (address _to, uint256 _newTokenId, uint256 _classId) public onlyAdmin returns (uint256) {        
            _mint(_to, _newTokenId, 1, "");
            users[_newTokenId].id = _newTokenId;
            users[_newTokenId].account = _to;
            users[_newTokenId].classId = _classId;
            return _newTokenId;
            
    }

    function burn(address _account, uint256 _id, uint256 _amount) override public onlyAdmin {
        require(balanceOf(_account, _id) > 0, "No token");
        users[_id].classId = 0;
        tokenURI[_id] = uri(_id);
        emit URI(tokenURI[_id], _id);
        _burn(_account, _id, _amount);
    }

    function burnBatchById(uint256[] memory _ids) public onlyAdmin {
        updateUsersClass(_ids, 0);
        for (uint256 i = 0; i < _ids.length; i++) {
            if (balanceOf(users[_ids[i]].account, _ids[i]) != 0) {
                _burn(users[_ids[i]].account, _ids[i], 1);
            }
        }
    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data) public override onlyOps {

        _safeTransferFrom(from, to, id, amount, data);
    }


    function onERC1155Received(address, address, uint256, uint256, bytes memory) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(address, address, uint256, bytes memory) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override (ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function renounceOwnership() override public virtual onlyAdmin {
    }

    //custom ownable functions
    function transferOwnership(address newOwner) override public onlyOwner{
        require(newOwner != address(0x0), "Ownable: new owner is the zero address");
         address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    //need to override to avoid conflicting instances of supportsInterface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
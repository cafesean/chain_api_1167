// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITemplateContract {
    function setStyles(string[] memory _styles) external;
    function authorizeCallingContract(address _remoteContractOwner, address _remoteContactAddress) external returns (bool);
    function generateUri(uint256 _tokenId) external view returns (string memory);
}
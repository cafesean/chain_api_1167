// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../Base.sol";
import "../Access.sol";
import "../interface/IProxy.sol";
import "hardhat/console.sol";

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
        
        // for (uint256 i = 1; i < 35; i++) {

        //     delete proxy._userAttributes(i, 5);
        // }
        

        proxy._setAttribute(5, "Based in", "loc");
        proxy._setAttribute(2, "Role", "pos");
        // proxy._setClass(0, _name, _description, _classUri, _templateAddress);
        // addClass(32,"Bambang","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/bambang.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);

        
        // addClass(1,"Member","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/member.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(3,"Member","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/member.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(0,"Danna","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/danna.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(0,"Delive","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/delive.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(0,"Amber","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/amber.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(0,"Bob","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/bob.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(0,"Arthur","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/arthur.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(0,"Kevin X","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/kevinx.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // // addClass(10,"Ray","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/ray.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(11,"Gary","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/gary.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(12,"Jon","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/jon.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(13,"Kevin Z","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/kevinz.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(14,"Joy","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/joy.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(15,"Helen","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/helen.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(16,"Young","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/young.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(17,"Jack","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/jack.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(18,"Carlos","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/carlos.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(19,"Reed","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/reed.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(20,"Duke","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/duke.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(21,"Rick","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/rick.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(22,"Eric","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/eric.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(23,"Lily","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/lily.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(24,"Christine","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/christine.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(25,"Simba","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/simba.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(26,"Harmony","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/harmony.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(27,"Jennifer","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/jennifer.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(28,"Ariel","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/ariel.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(29,"Mandy","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/mandy.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(30,"Lynn","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/lynn.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(31,"Ned","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/ned.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(32,"Bam","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/bam.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(33,"Carrie","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/carrie.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(34,"Yi Jing","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/yijing.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);
        // addClass(35,"Chuyi","Imaginato Special Edition","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/chuyi.png",0xB5db2AA258009e08370bA1Fd3e9f9504cc829C7e);

// addSkill(0,"SEAN","Sean","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/sean.png");
// addSkill(0,"DANNA","Danna","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/danna.png");
// addSkill(0,"DELIVE","Delive","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/delive.png");
// addSkill(0,"AMBER","Amber","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/amber.png");
// addSkill(0,"BOB","Bob","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/bob.png");
// addSkill(0,"ARTHUR","Arthur","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/arthur.png");
// addSkill(0,"KEVIN X","Kevin X","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/kevinx.png");
// addSkill(10,"RAY","Ray","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/ray.png");
// addSkill(11,"GARY","Gary","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/gary.png");
// addSkill(12,"JON","Jon","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/jon.png");
// addSkill(13,"KEVIN Z","Kevin Z","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/kevinz.png");
// addSkill(14,"JOY","Joy","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/joy.png");
// addSkill(15,"HELEN","Helen","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/helen.png");
// addSkill(16,"YOUNG","Young","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/young.png");
// addSkill(17,"JACK","Jack","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/jack.png");
// addSkill(18,"CARLOS","Carlos","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/carlos.png");
// addSkill(19,"REED","Reed","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/reed.png");
// addSkill(20,"DUKE","Duke","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/duke.png");
// addSkill(21,"RICK","Rick","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/rick.png");
// addSkill(22,"ERIC","Eric","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/eric.png");
// addSkill(23,"LILY","Lily","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/lily.png");
// addSkill(24,"CHRISTINE","Christine","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/christine.png");
// addSkill(25,"SIMBA","Simba","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/simba.png");
// addSkill(26,"HARMONY","Harmony","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/harmony.png");
// addSkill(27,"JENNIFER","Jennifer","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/jennifer.png");
// addSkill(28,"ARIEL","Ariel","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/ariel.png");
// addSkill(29,"MANDY","Mandy","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/mandy.png");
// addSkill(30,"LYNN","Lynn","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/lynn.png");
// addSkill(31,"NED","Ned","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/ned.png");
// addSkill(32,"BAM","Bam","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/bam.png");
// addSkill(33,"CARRIE","Carrie","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/carrie.png");
// addSkill(34,"YI JING","Yi Jing","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/yijing.png");
// addSkill(35,"CHUYI","Chuyi","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/svg/chuyi.png");

        // proxy._setSkill(0, _code, _name, _skillUri);
        // proxy._setClass(9,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/danna.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(62,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/delive.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(2,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/amber.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(5,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/bob.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(4,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/arthur.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(19,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/kevinx.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(25,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/ray.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(12,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/gary.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(17,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/jon.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(20,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/kevinz.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(18,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/joy.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(14,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/helen.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(31,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/young.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(15,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/jack.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(1,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/carlos.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(26,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/reed.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(10,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/duke.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(27,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/rick.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(11,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/eric.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(21,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/lily.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(7,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/christine.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(29,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/simba.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(13,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/harmony.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(16,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/jennifer.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(3,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/ariel.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(23,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/mandy.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(22,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/lynn.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(24,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/ned.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(63,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/bam.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(6,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/carrie.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(30,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/yijing.png",0x0000000000000000000000000000000000000000);
        // proxy._setClass(8,"","","https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/10th/main/chuyi.png",0x0000000000000000000000000000000000000000);
        // addClass("Carlos", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/carlos.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Bambang", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/bambang.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Delive", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/delive.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Bob", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/bob.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Carrie", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/carrie.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Christine", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/christine.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Chuyi", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/chuyi.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Danna", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/danna.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Duke", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/duke.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Eric", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/eric.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Gary", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/gary.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Harmony", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/harmony.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Helen", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/helen.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Jack", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/jack.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Jennifer", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/jennifer.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Jon", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/jon.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Joy", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/joy.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Kevin X", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/kevinx.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Kevin Z", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/kevinz.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Lily", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/lily.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Lynn", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/lynn.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Mandy", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/mandy.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Ned", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/ned.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Ray", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/ray.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Reed", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/reed.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Rick", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/rick.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Sean", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/sean.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Simba", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/simba.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Yi Jing", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/yijing.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        // addClass("Young", "Imaginato Special Edition", "https://jetdevs-web3.s3.ap-southeast-1.amazonaws.com/nft/img/young.png", 0x2B877F798F5Ab23581C6337De68338C225Da9B3d);
        
        // setStyles(1,["5","60","gold","3","0.6","black"]);

        // addSkill("GOLANG", "Golang", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-golang.png");
        // addSkill("JAVA", "Java", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-java.png");
        // addSkill("NODEJS", "NodeJS", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-nodejs.png");
        // addSkill("REACTJS", "ReactJS", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-reactjs.png");
        // addSkill("IOS", "iOS", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-ios.png");
        // addSkill("ANDROID", "Android", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-android.png");
        // addSkill("PHP", "PHP", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-php.png");
        // addSkill("FLUTTER", "Flutter", "https://bafybeicylntkgj32kaqt7jfnj7ppv5o3o4xzgjss5ug363skukhf3ocvoq.ipfs.nftstorage.link/skills/v1-flutter.png");













        console.log("Functions loade. Self-destructing...");
        
        //selfdestruct
        selfdestruct(payable(_msgSender()));

    }

    function transferToAssignee(address _assigneeAddress) public {
        proxy.transferOwnership(_assigneeAddress);
    }

    function addClass(uint256 _id, string memory _name, string memory _description, string memory _classUri, address _templateAddress) public {
    console.log("   In addClass");
        proxy._setClass(_id, _name, _description, _classUri, _templateAddress);
    }

    function addSkill(uint256 _id, string memory _code, string memory _name, string memory _skillUri) public {
    console.log("   In addSkill");
        proxy._setSkill(_id, _code, _name, _skillUri);
    }

    function addAttribute(string memory _name, string memory _code) public {
        proxy._setAttribute(0, _name, _code);
    }

    // function setStyles(uint256 _classId, string[6] memory _styles) public {
    //     proxy._setStyles(_classId, _styles);
    // }

    function destroy() external onlyOwner {
        require(_msgSender() == _owner);
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



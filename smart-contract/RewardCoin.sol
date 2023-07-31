// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract RewardCoin is ERC20, ERC20Burnable {

    address owner;

    // Chain events
    event StatsReset(string _event_text, address _for);
    event LevelChange(string _event_text, address _event_causer);
    event UserRegistered(string _event_text, address _event_causer);
    event RewardObtained(string _event_text, address _event_causer);

    // User related mappings
    mapping(address => bool) is_registered;
    mapping(address => uint256) level;
    mapping(address => uint256) lvlup_cost;
    mapping(address => uint256) lvlup_cost_increase;

    // Functionality related constans
    uint256 public constant START_LVL = 1;
    uint256 public constant LVLUP_COST_START = 5;
    uint256 public constant LVL_UP_COST_JUMP = 5;

    constructor() ERC20("RewardCoin", "RC") {
        owner = msg.sender;
    }

    modifier OnlyRegistered() {
        require(is_registered[msg.sender] == true, "You have to register in order to use this application.");
        _;
    }

    modifier OnlyOnwer() {
        require(msg.sender == owner, "You are not allowed to use this method.");
        _;
    }

    modifier EnoughFunds() {
        require(balanceOf(msg.sender) >= lvlup_cost[msg.sender], "You don't have enough tokens.");
        _;
    }

    function resetUserStats(address _user) public OnlyOnwer payable {
        is_registered[_user] = false;
        level[_user] = START_LVL;
        lvlup_cost[_user] = LVLUP_COST_START;
        lvlup_cost_increase[_user] = LVL_UP_COST_JUMP;

        emit StatsReset("Stats were successfully reset.", _user);
    }

    function registerUser() public payable {
        is_registered[msg.sender] = true;
        level[msg.sender] = START_LVL;
        lvlup_cost[msg.sender] = LVLUP_COST_START;
        lvlup_cost_increase[msg.sender] = LVL_UP_COST_JUMP;

        emit UserRegistered("User was successfully created.", msg.sender);
    }

    function getReward(uint256 _task_reward) public OnlyRegistered payable {
        _mint(msg.sender, _task_reward);

        emit RewardObtained("You received reward for your task.", msg.sender);
    }

    function levelUpAccount() public OnlyRegistered EnoughFunds payable {
        level[msg.sender] = level[msg.sender] + 1;
        _burn(msg.sender, lvlup_cost[msg.sender]);
        lvlup_cost[msg.sender] = level[msg.sender] + lvlup_cost_increase[msg.sender];
        lvlup_cost_increase[msg.sender] = level[msg.sender] + LVL_UP_COST_JUMP;

        emit LevelChange("Account was successfully level up!", msg.sender);
    }

    function getCurrentLevel() public OnlyRegistered view returns(uint256) {
        return level[msg.sender];
    }

    function getCurrentLevelUpPrice() public OnlyRegistered view returns(uint256) {
        return lvlup_cost[msg.sender];
    }

    function isRegistered() public view returns(bool) {
        return is_registered[msg.sender];
    }
}

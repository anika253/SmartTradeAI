// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AITradingBot {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function executeTrade(string memory action, uint256 amount) public {
        require(msg.sender == owner, "Only owner can execute trades");
    }
}

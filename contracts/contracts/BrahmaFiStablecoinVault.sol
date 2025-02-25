// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract BrahmaFiStablecoinVault {
    mapping(address => uint256) public balances;

    function depositStablecoin(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        balances[msg.sender] += amount;
    }

    function withdrawStablecoin(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
    }
}

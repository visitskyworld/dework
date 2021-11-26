// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract DAO_Wallet {
    uint256 public balance;
    address public owner;
    mapping(address => bool) public admins;

    constructor() {
        owner = msg.sender;
        admins[owner] = true;
    }

    function setOwner(address newAdmin) public {
        require(msg.sender == owner, "Must be owner");
        admins[newAdmin] = true;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function deposit() public payable {
        //require(msg.value == amount);
        // nothing else to do!
    }

    function transfer(address receiver, uint256 amount) public {
        require(
            admins[msg.sender] == true,
            "You don't have permission for this"
        );
        require(amount <= address(this).balance, "Not enough funds");
        payable(receiver).transfer(amount);
        //payable(receiver).transfer(address(this).balance);
    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}

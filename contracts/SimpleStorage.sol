pragma solidity ^0.4.18;

contract SimpleStorage {
    string public message;
    
    constructor() public {
        message = "Hello, World!";
    }

    event MessageEvent(string message);
    
    function setMessage(string newMessage) public {
        message = newMessage;

        emit MessageEvent(newMessage);
    }
}

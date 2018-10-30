pragma solidity ^0.4.17;

contract Swear{

    struct Msg {
        string word;
        address from;
        uint timestamp;
    }

    Msg[] private msgArr;

    function publish(string w) public payable{
        msgArr.push(Msg(w, msg.sender, now));
    }

    function randomGet(uint r) public view returns(string, address, uint){
        if(msgArr.length == 0){
            return ("", address(0), 0);
        }else {
            Msg storage msg = msgArr[r];
            return (msg.word, msg.from, msg.timestamp);
        }
    }
    function msgCount() public view returns(uint){
        return msgArr.length;
    }

}
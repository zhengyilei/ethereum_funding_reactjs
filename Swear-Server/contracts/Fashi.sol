pragma solidity ^0.4.17;

contract Fashi{

    struct Msg {
        string word;
        string from;
        address sender;
        uint blockNumber;
        uint timestamp;
    }

    Msg[] private msgArr;

    function publish(string w, string from) public payable{
        msgArr.push(Msg(w, from, msg.sender, block.number, now));
    }

    function randomGet(uint r) public view returns(string, string, address, uint, uint){
        if(msgArr.length == 0){
            return ("", "", address(0), 0, 0);
        }

        Msg storage data = msgArr[r];
        return (data.word, data.from, data.sender, data.blockNumber, data.timestamp);
    }

    function msgCount() public view returns(uint){
        return msgArr.length;
    }

}
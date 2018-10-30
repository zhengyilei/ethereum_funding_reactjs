const initContract = (web3) => {

    const address = '0x9106484205ccb1BEAF8f7df2A0999DB93A88b40A';
    const abi = [{"constant": true, "inputs": [], "name": "msgCount", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [{"name": "r", "type": "uint256"}], "name": "randomGet", "outputs": [{"name": "", "type": "string"}, {"name": "", "type": "string"}, {"name": "", "type": "address"}, {"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"outputs": [], "constant": false, "inputs": [{"name": "w", "type": "string"}, {"name": "from", "type": "string"}], "name": "publish", "payable": true, "stateMutability": "payable", "type": "function"}];
    return new web3.eth.Contract(abi, address);
};

module.exports = initContract;
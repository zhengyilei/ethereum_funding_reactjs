const initContract = (web3) => {

    const address = '0x389dD55b25481544786F0028c3B8296c0458Fef5';
    const abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "w",
                    "type": "string"
                }
            ],
            "name": "publish",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "msgCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "r",
                    "type": "uint256"
                }
            ],
            "name": "randomGet",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
    return new web3.eth.Contract(abi, address);
};

export default initContract;
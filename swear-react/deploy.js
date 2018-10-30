const Web3 = require('web3');

const {interface, bytecode} = require('./compile');

const HDWalletProvider = require('truffle-hdwallet-provider');

let mnemonic = 'hidden oppose 8ifnba sudfiuh';
const provider = new HDWalletProvider(mnemonic,'https://rinkeby.infura.io/v3/82a59ec1db144c82873d6a0f937e4d4a');

const web3 = new Web3(provider);

deploy = async () => {

    let gasEstimate = await web3.eth.estimateGas({data: '0x' +bytecode});
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    console.log('account: ' + account);
    const contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: account, gas: gasEstimate});

    // console.log('gasEstimate: ' + gasEstimate);

    console.log("address: " + contract.options.address);
    console.log('--------------------------------------');
    console.log(interface);

};

deploy();
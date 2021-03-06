const Web3 = require('web3');

const compileContracts = require('./compile');

const HDWalletProvider = require('truffle-hdwallet-provider');

let mnemonic = 'hidden oppose around lion adult message prosper earth october grocery twist symbol';
const provider = new HDWalletProvider(mnemonic,'https://rinkeby.infura.io/v3/82a59ec1db144c82873d6a0f937e4d4a');

const web3 = new Web3(provider);

async function deployContract(compileContract, contractName) {
    const {interface, bytecode} = compileContract;

    let gasEstimate = await web3.eth.estimateGas({data: '0x' + bytecode});
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    console.log('account: ' + account);
    const contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: account, gas: gasEstimate});

    console.log(contract);

    console.log("address: " + contract.options.address + " => " + contractName);
    console.log('--------------------------------------FundingFactory interface');
    console.log(interface);
}

deploy = async () => {
    await deployContract(compileContracts.FundingFactory, 'FundingFactory');
    // await deployContract(compileContracts.Funding, 'Funding');

    console.log('--------------------------------------Funding interface');
    console.log(compileContracts.Funding.interface);

};

deploy();
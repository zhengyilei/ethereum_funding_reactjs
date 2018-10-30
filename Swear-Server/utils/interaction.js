const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const initContract = require('./contract');

let mnemonic = 'hidden oppose around lion adult message prosper earth october grocery twist symbol';
const provider = new HDWalletProvider(mnemonic,'https://rinkeby.infura.io/v3/82a59ec1db144c82873d6a0f937e4d4a');
const web3 = new Web3(provider);

const contract = initContract(web3);

// let resultJSON = {
//     "blockHash": "0x5fe37446efc5665669b57dc48af1cc0b887b593702f2fcdbfa28eabc071749b4",
//     "blockNumber": 2775123,
//     "contractAddress": null,
//     "cumulativeGasUsed": 1087146,
//     "from": "0x7855f93c158b36c93d0e34eb6be6b2dcfd3587e4",
//     "gasUsed": 754506,
//     "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
//     "status": true,
//     "to": "0xc3e8a7bafcc4afa6f4fc701a6cc907fb85970290",
//     "transactionHash": "0xf6466d4559d45e1aa9e3cc15c43196ace10a78701319530b77f4027f5f1c647b",
//     "transactionIndex": 3,
//     "events": {}
// }
/**
 * 发表誓言
 * @param word
 * @param from
 * @returns {Promise<any>}
 */
const publishSwear = (word, from) => {
   return new Promise((resolve, reject) => {
       web3.eth.getAccounts().then(accounts => {
           contract.methods.publish(word, from)
               .send({
                   from: accounts[0],
                   gas: 3000000
               }).then(result => {
                   resolve(result)
               }).catch( e => {
                   reject(e);
               })

       }).catch(e => {
           reject(e);
       });
   })

};
/**
 * 获取誓言
 * @type {function({publishSwear: (function(*=, *): Promise<any>)}): Promise<any>}
 */
const getMsg = (r) => {
    return new Promise((resolve, reject) => {
        contract.methods.randomGet(r).call()
            .then(result => {
                resolve(result);
            }).catch( e => {
                reject(e);
            })
    })
};

/**
 * 获取誓言个数
 * @param r
 * @returns {Promise<Object>}
 */
const msgCount = () => {
    return new Promise((resolve, reject) => {
        contract.methods.msgCount().call()
            .then(result => {
                resolve(result);
            }).catch( e => {
            reject(e);
        })
    })
};

module.exports = {
    publishSwear,
    getMsg,
    msgCount
};
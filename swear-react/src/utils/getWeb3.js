import Web3 from 'web3'

let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        let results;
        let web3 = window.web3;

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider.
            web3 = new Web3(web3.currentProvider);

            results = {web3};

            console.log('Injected web3 detected.');

            resolve(results)
        } else {
            // Fallback to localhost if no web3 injection. We've configured this to
            // use the development console's port by default.
            // let localhost = 'http://127.0.0.1:9545';
            let host = 'https://rinkeby.infura.io/v3/b5193966085f4ae0a469a7a77215b0ba';
            // let host = 'https://rinkeby.infura.io/v3/82a59ec1db144c82873d6a0f937e4d4a';
            let provider = new Web3.providers.HttpProvider(host);

            web3 = new Web3(provider);

            results = {web3};

            console.log('No web3 instance injected, using rinkeby web3.');

            resolve(results)
        }
    })
});

export default getWeb3

const fs = require('fs');
const path = require('path');
const solc = require('solc');

function compileSol(contractName) {
    const filepath = path.join(__dirname, 'contracts', `${contractName}.sol`);
    console.log(filepath);
    const source = fs.readFileSync(filepath, 'utf-8');
    const compile = solc.compile(source, 1);
    console.log(compile);
    return compile.contracts[`:${contractName}`];
}


module.exports = compileSol;

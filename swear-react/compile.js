const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'contracts', 'Swear.sol');
const solc = require('solc');

console.log(filepath);

const source = fs.readFileSync(filepath, 'utf-8');
const compile = solc.compile(source, 1);

module.exports = compile.contracts[':Swear'];

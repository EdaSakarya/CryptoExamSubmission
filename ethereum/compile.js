const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// TODO: writing correct ContractName
const campaignPath = path.resolve(__dirname, 'contracts', 'ExamFactory.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source,1).contracts;

//create the Build Folder
fs.ensureDirSync(buildPath);


// write JSON in File
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}
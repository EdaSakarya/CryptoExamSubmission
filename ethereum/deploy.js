const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ExamPool.json');

const provider = new HDWalletProvider(
    'seat level rough increase tornado skill firm ozone endless lawsuit erupt addict',
    'https://rinkeby.infura.io/v3/14948117edc6406db057691f2af77dcc'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(
        compiledFactory.abi
    )
        .deploy({data: compiledFactory.bytecode})
        .send({gas: '5000000', from: accounts[0]});
    console.log('Contract deployed to', result.options.address);
};

deploy();



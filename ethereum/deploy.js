const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
//TODO: writing correct Contract JSON file
const compiledFactory = require('./build/ExamPool.json');

const provider = new HDWalletProvider(
    'seat level rough increase tornado skill firm ozone endless lawsuit erupt addict',
    'https://rinkeby.infura.io/v3/14948117edc6406db057691f2af77dcc'
);
// we can use this web3-constant for sending or changing data (making transactions)
const web3 = new Web3(provider);

const deploy = async () => {
    //Mneumonic has many accounts
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    )
        .deploy({data: compiledFactory.bytecode})
        .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};

deploy();



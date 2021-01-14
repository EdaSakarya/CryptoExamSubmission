import web3 from './web3';
// import Campaign from './build/[SolidityContract].json';

export default (address) => {
    return new web3.eth.Contract(
        // TODO: writing correct Contract Name
        JSON.parse([Contract].interface),
        address
    );
};
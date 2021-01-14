
import web3 from './web3';
// TODO: writing correct Contract JSON File Name
import CampaignFactory from './build/[ContractJSON].json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x4da54412bF7B2dF1f13d790af69856Fb4757Ea94'
);

export default instance;
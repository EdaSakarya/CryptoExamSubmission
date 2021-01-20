import web3 from './web3';
// TODO: writing correct Contract JSON File Name
import ExamPool from './build/ExamPool.json';

const instance = new web3.eth.Contract(
    JSON.parse(ExamPool.interface),
    '0xec0c74fbfab462977c5b2f00cc5682245a6afab7'
);

export default instance;
import web3 from './web3';
// TODO: writing correct Contract JSON File Name
import ExamPool from './build/ExamPool.json';

const instance = new web3.eth.Contract(
    JSON.parse(ExamPool.interface),
    '0x9e65a0870388f1dc1b6bb2984a773f94f52febd6'
);

export default instance;
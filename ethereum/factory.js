import web3 from './web3';
// TODO: writing correct Contract JSON File Name
import ExamPool from './build/ExamPool.json';

const instance = new web3.eth.Contract(
    JSON.parse(ExamPool.interface),
    '0x4A4248ed37536737D002362dE0Da255e8F4c0194'
);

export default instance;
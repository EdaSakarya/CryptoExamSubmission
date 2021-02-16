import web3 from './web3';
// TODO: writing correct Contract JSON File Name
import ExamPool from './build/ExamPool.json';

const instance = new web3.eth.Contract(
    JSON.parse(ExamPool.interface),
    '0xF7A263c82c71d17599B6037215C69Fb9DF1b7598'
);

export default instance;
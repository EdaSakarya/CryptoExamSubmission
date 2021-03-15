import web3 from './web3';
// TODO: writing correct Contract JSON File Name
import ExamPool from './build/ExamPool.json';

const instance = new web3.eth.Contract(
    JSON.parse(ExamPool.interface),
    '0x7F88717775B65d6aDbF8FBaac291C46D933E5b91'
);

export default instance;
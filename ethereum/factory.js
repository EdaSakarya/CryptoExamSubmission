import web3 from './web3';
import ExamPool from './build/ExamPool.json';

//contract version 0.8.3
const instance = new web3.eth.Contract(ExamPool.abi, '0x2443cC910F001074F2Ba2C95892a8B1E0a4b013E');
export default instance;

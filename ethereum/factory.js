import web3 from './web3';
import ExamPool from './build/ExamPool.json';

// Contract with version 0.5.1
//const instance = new web3.eth.Contract(ExamPool.abi,'0xaFa04dB793cc5F02d762367c5Af8b23b50D6AA61');
//Contract version 0.5.16
// const instance = new web3.eth.Contract(ExamPool.abi,'0x9411114Ec257DE782a21Fec347377fA48dfc07dc');
//Contract version 0.5.16_together
// const instance = new web3.eth.Contract(ExamPool.abi, '0x6965C905D649c98C1ad1461dAf939EB2048ece50');
// Contract with version 0.4.16
//const instance = new web3.eth.Contract(ExamPool.abi,'0xaFa04dB793cc5F02d762367c5Af8b23b50D6AA61');

//contract version 0.8.3
const instance = new web3.eth.Contract(ExamPool.abi, '0x20dcE8C57F04C0eF397E5d137E84b0b4229fB8eb');
export default instance;

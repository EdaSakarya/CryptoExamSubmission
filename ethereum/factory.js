import web3 from './web3';
import ExamPool from './build/ExamPool.json';

//contract version 0.8.3
const instance = new web3.eth.Contract(ExamPool.abi, '0x40CB29641E1F1CC25114Adb928E0f278E334f556');
// const instance = new web3.eth.Contract(ExamPool.abi, '0xDA36fDA08E6E00dDA10c657fed99615B454C2e14');
export default instance;

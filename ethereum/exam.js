import web3 from './web3';
import ExamSubmission from './build/ExamSubmission.json';

export default (address) => {
    return new web3.eth.Contract(ExamSubmission.abi, address);
};

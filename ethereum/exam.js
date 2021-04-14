import web3 from './web3';
import ExamSubmission from './build/ExamSubmission.json';

export default (address) => {
    return new web3.eth.Contract(ExamSubmission.abi, address);
};

/*export default (address) => {
    return new web3.eth.Contract(ExamSubmission.abi, '0x0fE98dD7A43a842dF4cD00d1A5E3051942A9c264');
}; */

//Contract version 0.5.16
// export default new web3.eth.Contract(ExamSubmission.abi, '0xb9dfb925eDd1B4b5645A402D079ae1E84ab339ae');

import web3 from './web3';
import ExamPool from './build/ExamPool.json';
import ExamDetails from './build/ExamSubmission.json';

export default (address) => {
    return new web3.eth.Contract(
        // TODO: writing correct Contract Name
        JSON.parse(ExamDetails.interface),
        address
    );
};
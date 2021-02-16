import web3 from './web3';
import ExamPool from './build/ExamPool.json';
import ExamDetails from './build/ExamDetails.json';

export default (address) => {
    return new web3.eth.Contract(
        // TODO: writing correct Contract Name
        JSON.parse(ExamPool.interface),
        address
    );
};
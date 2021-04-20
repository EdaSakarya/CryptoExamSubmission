import factory from "../../ethereum/factory";
import accountHandler from  "../api/accounts";
import web3 from "../../ethereum/web3";
import Web3 from "web3";

const ethEnabled = () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        console.log('true');
        return true;
    }
    console.log('false');
    return false;
}

async function addresses() {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    ethEnabled();
    const exams = await factory.methods.getExamsOfUser(accounts[0]).call();
    console.log('API',exams);
    return exams;
}
export default addresses;

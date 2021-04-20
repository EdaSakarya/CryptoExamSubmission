// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import web3 from "../../ethereum/web3";

async function blockHandler() {
    const accounts = await web3.eth.getAccounts();
    console.log('API',accounts);
    return accounts;
}

export default blockHandler;

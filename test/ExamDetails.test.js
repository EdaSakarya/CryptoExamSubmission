const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({gasLimit: 1000000000}));
const provider = ganache.provider();

const compiledExamPool = require('../ethereum/build/ExamPool.json');
const compiledExamDetails = require('../ethereum/build/ExamSubmission.json');

let accounts;
let pool;
let admin;
let userProf;
let accountProf = [];
let accountStudent = [];
let userStudent;
let exam;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    accountStudent.push(accounts[1]);
    accountProf.push(accounts[2]);
    pool = await new web3.eth.Contract(compiledExamPool.abi)
        .deploy({data: compiledExamPool.bytecode})
        .send({from: accounts[0], gas: '5000000'});
    admin = await pool.methods.createAdmin().send({
        from: accounts[0]
    });
    userStudent = await pool.methods.createUser(1, accounts[1])
        .send({from: accounts[0]});
    userProf = await pool.methods.createUser(0, accounts[2])
        .send({from: accounts[0]});
});

describe('Functions in ExamPool', () => {
    it('deploys a ExamPool', () => {
        assert.ok(pool.options.address);
    });

    it('marks "createAdmin"-caller as Admin', async () => {
        const testAdmin = await pool.methods.createAdmin().send({
            from: accounts[0]
        });
        assert.ok(testAdmin);
        assert.ok(admin);
    });

    it('allows only admin to create new user', async () => {
        try {
            await pool.methods.createUser(1, accounts[4])
                .send({from: accounts[1], gas: '1000000'});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows only creation only once of an account', async () => {
        try {
            await pool.methods.createUser(1, accounts[3])
                .send({from: accounts[0], gas: '1000000'});
            assert(false);
        } catch (err) {
            assert(err);
        }
    })

    it('allows to create new exams', async () => {
        const creation = await pool.methods.createExam('ITSM', 'Labor Aufgaben 1', 1 ,'ITSM Labor', 1624016495, accountStudent, accountProf)
            .send({
                from: accounts[0], gas: '5000000'
            });

        assert.ok(creation);
    });

    it('allows only admin to create new exams', async () => {
       try {
           await pool.methods.createExam('ITSM', 'Labor Aufgaben 1', 1, 'ITSM Labor', 1624016495, accountStudent, accountProf)
               .send({
                   from: accounts[1], gas: '5000000'
               });
           assert(false);
       }catch(err){
           assert(err);
       }
    });

    it('allows to get address of an exam', async () => {
    const address = await pool.methods.getExamsOfUser(accounts[1]).call();

    });
});

describe('Functions in ExamSubmission', () => {
    it('allows only student to upload a data', async () => {

    });
    it('allows only professor to set the status of exam to "inCorrection"', async () => {

    });
    it('allows only professor to grade and comment an exam', async () => {

    });
})

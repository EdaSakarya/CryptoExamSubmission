import React, {Component} from 'react';
import Layout from "../../components/Layout";
import Exam from '../../ethereum/exam';
import {Progress, Card, Grid, Form, Button, Divider, Header, Input, Message} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import web3 from "../../ethereum/web3";

class ExamDetailsShow extends Component {
    state = {
        errorMessage: '',
        errormessage2: '',
        errormessage3: '',
        grade: '',
        comment: '',
        loading: false
    };

    static async getInitialProps(props) {
        const exam = Exam(props.query.address);
        const details = await exam.methods.getDetailsOfExam().call();
        const accounts = await web3.eth.getAccounts();
        const output = await exam.methods.downloadExam().call();
        console.log('student', details[7]);
        return {
            account: accounts[0],
            address: props.query.address,
            description: details[0],
            subject: details[1],
            typeOfWork: details[2],
            typeOfSubmission: details[3],
            submissionTime: details[4],
            grade: details[5],
            comment: details[6],
            student: details[7],
            prof: details[8],
            status: details[9],
            download: output
        };
    };

    renderCards() {
        let statusContent = '';
        if (this.props.status == 0) {
            statusContent = 'to submit';
        } else if (this.props.status == 1) {
            statusContent = 'submitted';
        } else if (this.props.status == 2) {
            statusContent = 'in correction';
        } else if (this.props.status == 3) {
            statusContent = 'corrected';
        }
        let gradeContent = '-';
        if (this.props.grade != 0) {
            gradeContent = this.props.grade;
        }
        const {
            subject,
            typeOfWork,
            submissionTime,
            comment,
            student,
            prof
        } = this.props;

        const dateTime = new Date(parseInt(submissionTime));

        const items = [
            {
                header: student,
                meta: 'Student Hash',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: prof,
                meta: 'Professor Hash',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: statusContent,
                meta: 'Status'
            },
            {
                header: subject,
                meta: 'Subject'

            },
            {
                header: typeOfWork,
                meta: 'Type of Work'
            },
            {
                header: dateTime.toLocaleString('de-DE'),
                meta: 'Submission Time and Date'
            },
            {
                header: gradeContent,
                meta: 'Grade'
            },
            {
                header: comment,
                meta: 'Comments of Professor'
            }

        ];
        return <Card.Group items={items}/>;
    }

    getDownload = async (event) => {
        event.preventDefault();
        const exam = Exam(this.props.address);
        try {
            const output = await exam.methods
                .downloadExam()
                .call();
            console.log(output);
            this.setState({download: output});
        } catch (err) {
            this.setState({errormessage2: err.message});
        }
    }

    setInCorrection = async (event) => {
        event.preventDefault();
        const exam = Exam(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            //console.log(accounts[0]);
            await exam.methods
                .setStatusInCorrection()
                .send({
                    from: accounts[0]
                });
        } catch (err) {
            this.setState({errormessage3: err.message});
        }
    }

    render() {
        const {status, student, account, professor, submissionTime} = this.props;
        return (
            <Layout>
                <h2>{this.props.description}</h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={4}>
                            {status >= 1 &&
                            <div>
                                <Divider horizontal>
                                    <Header as='h6'>
                                        download & upload
                                    </Header>
                                </Divider>
                                <Link href={`https://ipfs.io/ipfs/${this.props.download}`} passHref={true}>
                                    <Button>Download</Button>
                                </Link>
                            </div>
                            }
                            <br/><br/>
                            {student == account &&
                            <div>
                                {/*{status < 2 && submissionTime > Date.now() &&*/}
                                <Link route={`/exams/${this.props.address}/uploads`}>
                                    <a>
                                        <Button primary>Upload</Button>
                                    </a>
                                </Link>
                                {/*}*/}
                            </div>
                            }
                            <br/><br/>
                            {student == account ? null : (
                                <div>
                                    <Divider horizontal>
                                        <Header as='h6'>
                                            grade & comment
                                        </Header>
                                    </Divider>

                                    {status == 1 &&
                                    <Button color='red' onClick={this.setInCorrection}>SET IN CORRECTION</Button>
                                    }
                                    <br/><br/>
                                    <div>
                                        {status == 2 && student != account &&
                                        <Link route={`/exams/${this.props.address}/grading`}>
                                            <Button color='orange'>GRADING</Button>
                                        </Link>
                                        }
                                    </div>
                                </div>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
            ;
    }
}

export default ExamDetailsShow;

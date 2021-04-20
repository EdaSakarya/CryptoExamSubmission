import React, {Component} from 'react';
import Exam from '../../ethereum/exam';
import accountHandler from "../api/accounts";
import web3 from "../../ethereum/web3";
import Link from "next/link";
import Layout from '../../components/Layout';
import {Card, Grid, Form, Button, Divider, Header, Input, Message} from 'semantic-ui-react';


class ExamDetails extends Component {
    state = {
        errorMessage: '',
        errormessage2: '',
        errormessage3: '',
        grade: '',
        comment: '',
        loading: false
    };

    setInCorrection = async (event) => {
        event.preventDefault();
        const exam = Exam(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await exam.methods
                .setStatusInCorrection()
                .send({
                    from: accounts[0]
                });
        } catch (err) {
            this.setState({errormessage3: err.message});
        }
    }

    renderCards() {
        let statusContent = '';
        if (this.props.status == 0) {
            statusContent = 'created';
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
        let studentString = student[0];
        let profString = prof[0];
        if (student[1] != undefined) {
            studentString = studentString + ', ' + student[1];
        }
        if (prof[1] != undefined) {
            profString = profString + ', ' + prof[1]
        }

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

    render() {
        const {status, student, account, professor, submissionTime} = this.props;
        const accounts = web3.eth.getAccounts();
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
                                <Button>
                                    {this.props.typeOfSubmission == 0 ?
                                        <Link href={`https://ipfs.io/ipfs/${this.props.download}`} passHref={true}>
                                            Download
                                        </Link> :
                                        <Link href={`${this.props.download}`} passHref={true}>
                                            Download
                                        </Link>}

                                </Button>
                            </div>
                            }
                            <br/><br/>

                            <div>
                                {status < 2 && submissionTime > Date.now() &&
                                <Link href={`/exam/upload/${this.props.address}`}>
                                    <a>
                                        <Button primary>Upload</Button>
                                    </a>
                                </Link>
                                }
                            </div>
                            <br/><br/>
                            <div>
                                <Divider horizontal>
                                </Divider>

                                {status == 1 &&
                                <Button color='red' onClick={this.setInCorrection}>SET IN CORRECTION</Button>
                                }
                                <br/><br/>
                                <div>
                                    {status == 2 &&
                                    <Link href={`/exam/grading/${this.props.address}`}>
                                        <Button color='orange'>GRADING</Button>
                                    </Link>
                                    }
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
            ;
    }
}


export async function getStaticPaths() {
    console.log('getstaticPaths');
    return {
        fallback: true,
        paths: [
            {
                params: {
                    exam: '0x57Ecd021F5c57174d1133bBbAb7d0869af4eE48e',
                },
            },
            {
                params: {
                    exam: '0x507db6D06C405990489c8dE1bC44500863391BE2',
                },
            },
        ],
    }
}

export async function getStaticProps(context) {
    const examAddress = await context.params.exam;
    const exam = await Exam(examAddress.toString());
    const details = await exam.methods.getDetailsOfExam().call();
    let output;
    if (details[9] >= 1) {
        output = await exam.methods
            .downloadExam()
            .call();
    } else {
        output = 'empty';
    }
    console.log(output);
    return {
        props: {
            address: examAddress,
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
        }
    };
}

export default ExamDetails;

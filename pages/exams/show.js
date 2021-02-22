import React, {Component} from 'react';
import Layout from "../../components/Layout";
import Exam from '../../ethereum/exam';
import {Card, Grid, Button} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import web3 from "../../ethereum/web3";

class ExamDetailsShow extends Component {
    static async getInitialProps(props) {
        const exam = Exam(props.query.address);
        const details = await exam.methods.getDetailsOfExam().call();
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);

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
            status: details[9]
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

        const dateTime = new Date(submissionTime * 1000);

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
                header: subject,
                meta: 'Subject'

            },
            {
                header: typeOfWork,
                meta: 'Type of Work'
            },
            {
                header: dateTime.toLocaleString(),
                meta: 'Submission Time and Date'
            },
            {
                header: gradeContent,
                meta: 'Grade'
            },
            {
                header: comment,
                meta: 'Comments of Professor'
            },
            {
                header: statusContent,
                meta: 'Status'
            }

        ];
        return <Card.Group items={items}/>;
    }

    getDownload = async (event) => {
        event.preventDefault();
        const exam = Exam(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0]);
            const output = await exam.methods
                .downloadExam()
                .call();
            console.log(output);
            this.setState({download: output});
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
    }

    async renderOnlyStudent() {
        //  const currentTime = Math.round(new Date().getTime() / 1000);
        const currentTime = 12123;
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        console.log(accounts[0] == this.props.student);
        if (accounts[0] === this.props.student) { /*&& this.props.submissionTime >= currentTime ){*/
            return <div>
                <Link route={`/exams/${this.props.address}/uploads`}>
                    <a>
                        <Button primary>Upload</Button>
                    </a>
                </Link>
            </div>
        } else {
            return <h1>${currentTime} </h1>
        }
    }

    render() {
        return (
            <Layout>
                <h2>{this.props.description}</h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={2}>
                          {/*  {this.renderOnlyStudent}*/}
                        </Grid.Column>
                    </Grid.Row>
                    {/*<Grid.Row>

                    </Grid.Row>*/}
                    <Grid.Row>
                        <Button onClick={this.getDownload}> Download</Button>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ExamDetailsShow;
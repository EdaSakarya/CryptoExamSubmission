import React, {Component} from 'react';
import Layout from "../../components/Layout";
import Exam from '../../ethereum/exam';
import {Card, Grid, Button} from 'semantic-ui-react';
import {Link} from '../../routes';

class ExamDetailsShow extends Component {
    static async getInitialProps(props) {
        const exam = Exam(props.query.address);
        const details = await exam.methods.getDetailsOfExam().call();
        return {
            address:props.query.address,
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
        let statusContent='';
        if(this.props.status==0){
            statusContent='to submit';
        }else if(this.props.status==1){
            statusContent='submitted';
        }else if(this.props.status==2){
            statusContent='in correction';
        }else if(this.props.status==3){
            statusContent='corrected';
        }
        let gradeContent = '-';
        if(this.props.grade != 0){
            gradeContent= this.props.grade;
        }
        const {
            description,
            subject,
            typeOfWork,
            submissionTime,
            grade,
            comment,
            student,
            prof
        } = this.props;

        const dateTime = new Date(submissionTime*1000);

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
            /*{
                header: description,
                meta: 'description'
            }*/

        ];
        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h2>{this.props.description}</h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            {/*<ContributeForm address={this.props.address}/>*/}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/exams/${this.props.address}/uploads`}>
                                <a>
                                    <Button primary>Upload</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ExamDetailsShow;
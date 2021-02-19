import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import {Button, Form, Input, Message, Table} from "semantic-ui-react";
import {Link, Router} from "../../../routes";
import Exam from '../../../ethereum/exam';
import RequestRow from "../../../components/RequestRow";
import {DateInput} from "semantic-ui-calendar-react";
import web3 from "../../../ethereum/web3";
import factory from "../../../ethereum/factory";

class RequestIndex extends Component {
    state = {
        upload:'',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const exam = Exam(props.query.address);
        const details = await exam.methods.getDetailsOfExam().call();
        return {
            exam,
            address:props.query.address,
            subject: details[1],
            typeOfSubmission: details[3],
            submissionTime: details[4],
            student: details[7],
            prof: details[8],
            status: details[9]
        };
    }
    onSubmit = async (event) => {
        event.preventDefault();
        const exam = Exam(this.props.address);
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0]);
            await exam.methods
                 .submitExam('SUBMITtest', this.state.upload)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    render() {
        let uploadType;
        if(this.props.TypeOfSubmission == 0){
            uploadType='File Upload';
        }else if(this.props.TypeOfSubmission == 1){
            uploadType='Link Upload';
        }
        return (
            <Layout>
                <h1> Exam Upload </h1>
                <h5>{this.props.subject}</h5>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>{uploadType}</label>
                        <Input value={this.state.upload}
                               onChange={event => this.setState({upload: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} type='submit' primary>Upload & Save</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestIndex;
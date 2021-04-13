import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import {Button, Form, Input, Message, Table} from "semantic-ui-react";
import {Link, Router} from "../../../routes";
import Exam from '../../../ethereum/exam';
import web3 from "../../../ethereum/web3";

class CommentingIndex extends Component {

    state = {
        comment: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const exam = Exam(props.query.address);
        const details = await exam.methods.getDetailsOfExam().call();
        return {
            address: props.query.address
        };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        const exam = Exam(this.props.address);
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            // console.log(accounts[0]);

            if (this.state.comment != '') {
                const commentOut = await exam.methods
                    .setComment(this.state.comment)
                    .send({
                        from: accounts[0]
                    });
               /* Router.pushRoute('/exams/show');*/
            } else {
                alert('No Comment!! ');
            }
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h1> Grading & leave a comment </h1>
                <h5>{this.props.subject}</h5>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Comment</label>
                        <Input value={this.state.comment}
                               onChange={event => this.setState({comment: event.target.value})}/>
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} type='submit' fluid primary
                            inverted>Submit</Button>
                </Form>
            </Layout>
        );
    }
}

export default CommentingIndex;

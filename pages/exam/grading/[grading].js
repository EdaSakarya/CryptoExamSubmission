import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import {Button, Form, Input, Message} from "semantic-ui-react";
import Exam from '../../../ethereum/exam';

export async function getStaticPaths() {
    return {
        fallback: true,
        paths: [
            {
                params: {
                    grading: '0x507db6D06C405990489c8dE1bC44500863391BE2',
                },
            },
            {
                params: {
                    grading: '0x507db6D06C405990489c8dE1bC44500863391BE2',
                },
            }, {
                params: {
                    grading: '0xC5f588298672077c28d69c287F3458ab0ADBe3A1',
                },
            },
        ],
    }
}

export async function getStaticProps(context) {
    return {
        props: {
            address: context.params.grading
        }
    };
}
class GradingIndex extends Component {

    state = {
        grade: '',
        comment: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});
        const exam = Exam(this.props.address);
        try {
            const accounts = await ethereum.request({method: 'eth_accounts'});
            const gradeOut = await exam.methods
                .setGradeAndComment(this.state.grade, this.state.comment)
                .send({
                    from: accounts[0]
                });
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h1> Grade & leave a comment </h1>
                <h5>{this.props.subject}</h5>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Grade</label>
                        <Input value={this.state.grade}
                               onChange={event => this.setState({grade: event.target.value})}/>
                    </Form.Field>
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

export default GradingIndex;

import React, {Component} from 'react';
import Layout from "../../components/Layout";
import {Button, Form, Input, Message, TextArea} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import {DateInput, TimeInput, DateTimeInput, DatesRangeInput} from "semantic-ui-calendar-react";

class NewExam extends Component {
    state = {
        professor: '',
        student: '',
        submissionType: '',
        date: '',
        subject: '',
        type: '',
        description: '',
        errorMessage: '',
        loading: false
    };
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0]);
            await factory.methods
                //.createExam(this.state.description, this.state.type, this.state.submissionType, this.state.subject, this.state.date, this.state.student, this.state.professor)
                .createExam(this.state.description, this.state.type, 1, this.state.subject, 1575909015, this.state.student, this.state.professor)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    };
    handleChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }


    render() {
        return (
            <div>
                <Layout>
                    <h1> New Exam </h1>

                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <Form.Field>
                            <label>Professor Address</label>
                            <Input value={this.state.professor}
                                   onChange={event => this.setState({professor: event.target.value})}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Student Address</label>
                            <Input value={this.state.student}
                                   onChange={event => this.setState({student: event.target.value})}
                            />
                        </Form.Field>
                        <Form.Group widths='equal'>
                            <Form.Field label='Type of Submission' control='select'>
                                <option value={this.state.link}
                                        onChange={event => this.setState({submissionType: event.target.value})}>Upload
                                    Link
                                </option>
                                <option value={this.state.file}
                                        onChange={event => this.setState({submissionType: event.target.value})}>Upload
                                    File
                                </option>
                            </Form.Field>
                            <Form.Field>
                                <label>Subject</label>
                                <Input value={this.state.subject}
                                       onChange={event => this.setState({subject: event.target.value})}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>Type of Work</label>
                                <Input value={this.state.type}
                                       onChange={event => this.setState({type: event.target.value})}
                                />
                            </Form.Field>

                            <DateInput
                                name="dateTime"
                               // placeholder="Date"
                                label="Submission Date"
                                value={this.state.date}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Field>
                            <label>Description</label>
                            <Input value={this.state.description}
                                   onChange={event => this.setState({description: event.target.value})}/>
                        </Form.Field>
                        <Message error header="Oops!" content={this.state.errorMessage}/>
                        <Button loading={this.state.loading} type='submit' primary>Create!</Button>
                    </Form>
                </Layout>
            </div>
        );
    };
}

export default NewExam;
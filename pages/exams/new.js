import React, {Component} from 'react';
import Layout from "../../components/Layout";
import {Button, Form, Input, Message, TextArea} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import DatePicker from "react-semantic-ui-datepickers";

class NewExam extends Component {
    state = {
        professor: '',
        student: '',
        submissionType: '',
        date: 0,
        subject: '',
        type: '',
        description: '',
        loading: false
    };
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createExam(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    };

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
                                        onChange={event => this.setState({link: event.target.value})}>Upload Link
                                </option>
                                <option value={this.state.file}
                                        onChange={event => this.setState({file: event.target.value})}>Upload File
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
                            <Form.Field>
                                <label>Submission date</label>
                                <DatePicker value={this.state.date}
                                       onChange={event => this.setState({date: event.target.value})}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.TextArea label="Description" placeholder="Details about the Exam"
                                       value={this.state.description}/>
                        <Message error header="Oops!" content={this.state.errorMessage}/>
                        <Button loading={this.state.loading} type='submit' primary>Create!</Button>
                    </Form>
                </Layout>
            </div>
        );
    };
}

export default NewExam;
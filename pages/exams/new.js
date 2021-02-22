import React, {Component} from 'react';
import Layout from "../../components/Layout";
import {Button, Divider, Form, FormField, Header, Icon, Input, Message, Select} from 'semantic-ui-react';
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
        errorMessage1: '',
        errorMessage2: '',
        userType: '',
        typeProf: '',
        typeStud: '',
        userKey: '',
        link: '',
        file: '',
        loading: false
    };
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage1: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0]);
            await factory.methods
                //.createExam(this.state.description, this.state.type, this.state.submissionType, this.state.subject, this.state.date, this.state.student, this.state.professor)
                .createExam(this.state.description, this.state.type, 1, this.state.subject, 1627052035, this.state.student, this.state.professor)
                /*.createExam('Aufgaben zu SQL-Abfragen', 'Labor Aufgaben 1', 1, 'Datenbanken Labor', 1629046800, 0xC0B6efb2Bd712884FD94ff410aE9Bd152Ae8fa8e, 0xCBB1BE6Ca524A4147f4bfa3D775fe095d9db2efC
                )*/
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage1: err.message});
        }
        this.setState({loading: false});
    };

    onSubmitUser = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage2: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createUser('1', this.state.userKey)
                .send({
                    from: accounts[0]
                });
            // Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage2: err.message});
        }
        this.setState({loading: false});
    };

    handleChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({[name]: value});
        }
    }

    render() {
        return (
            <div>
                <Layout>
                    <br/>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='clipboard icon'/>
                            New Exam
                        </Header>
                    </Divider>

                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage1}>
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
                                        onChange={event => this.setState({submissionType: 1})}>Upload
                                    Link
                                </option>
                                <option value={this.state.file}
                                        onChange={event => this.setState({submissionType: 0})}>Upload
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
                        <Message error header="Oops!" content={this.state.errorMessage1}/>
                        <Button loading={this.state.loading} type='submit' fluid inverted color='red'>Create
                            Exam</Button>
                    </Form>
                    <br/>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='address book icon'/>
                            New User
                        </Header>
                    </Divider>
                    <Form onSubmit={this.onSubmitUser} error={!!this.state.errorMessage2}>
                        <Form.Field label='Type of Submission' control='select'>

                            <option value={this.state.typeProf}
                                    onChange={event => this.setState({userType: event.target.value})}>Professor
                            </option>
                            <option value={this.state.typeStud}
                                    onChange={event => this.setState({userType: event.target.value})}> Student
                            </option>
                        </Form.Field>
                        <Form.Field>
                            <label>User Key</label>
                            <Input value={this.state.userKey}
                                   onChange={event => this.setState({userKey: event.target.value})}/>
                        </Form.Field>
                        <Message error header="Oops!" content={this.state.errorMessage2}/>
                        <Button loading={this.state.loading} type='submit' fluid primary inverted color='red'>Create
                            User</Button>
                    </Form>
                    <br/>
                </Layout>
            </div>
        );
    };
}

export default NewExam;
import React, {Component} from 'react';
import Layout from "../../components/Layout";
import {Button, Divider, Form, Header, Icon, Input, Message} from 'semantic-ui-react';
import Select from 'react-select';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import TextField from '@material-ui/core/TextField';

const userOptions = [
    {value: 0, label: 'Student'},
    {value: 1, label: 'Professor'},
];
const typeOptions = [
    {value: 0, label: 'File'},
    {value: 1, label: 'Link'},
];

class NewExam extends Component {

    state = {
        professor: '',
        student: '',
        submissionType: '',
        date: '',
        timestamp: '',
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
                .createExam(this.state.description, this.state.type, this.state.submissionType, this.state.subject, this.state.timestamp, this.state.student, this.state.professor)
                //.createExam(this.state.description, this.state.type, 1, this.state.subject, this.state.timestamp, this.state.student, this.state.professor)
                /*.createExam('Lektion 4 Aufgaben', 'Labor Aufgaben 1', 1 ,'ITSM Labor', 1629046800, 0xC0B6efb2Bd712884FD94ff410aE9Bd152Ae8fa8e, 0xCBB1BE6Ca524A4147f4bfa3D775fe095d9db2efC
                */
                .send({
                    from: accounts[0]
                });
            // Router.pushRoute('/');
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
                .createUser(this.state.userType, this.state.userKey)
                .send({
                    from: accounts[0]
                });
            // Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage2: err.message});
        }
        this.setState({loading: false});
    };

    handleChangeUser = userType => {
        this.setState({userType: userType.value});
        console.log(`Option selected:`, this.state.userType);
    }
    handleChangeType = async type => {
        this.setState({submissionType: type.value});
        console.log(`Option selected:`, this.state.submissionType);
    }

    handleChangeTime = time => {
        let date = Date.parse(time.target.value);
        this.setState({timestamp: date});
        console.log('Time and Date Set: ', date);
    }

    render() {
        const {userType, submissionType} = this.state;
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
                        <Select value={submissionType}
                                onChange={this.handleChangeType}
                                options={[
                                    {value: 0, label: 'File'},
                                    {value: 1, label: 'Link'},
                                ]}
                        />
                        <Form.Group widths='equal'>
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

                            {/* <DateInput
                                name="dateTime"
                                // placeholder="Date"
                                clearable
                                closable
                                //label="Submission Date"
                                //value={this.state.date}
                                iconPosition="left"
                                onChange={this.handleChangeTime}
                            />
                            <DateTimeInput
                                name="dateTime"
                                clearable
                                closable
                                markColor
                                value={this.state.date}
                                iconPosition="left"
                                onChange={this.handleChangeTime}
                            />*/}
                            {/* <TimeInput
                                name="time"
                                //placeholder="Time"
                                clearable
                                closable
                                //value={this.state.time}
                                iconPosition="left"
                                onChange={this.handleChangeTime}
                            />*/}

                            <TextField
                                id="datetime-local"
                                label="Next appointment"
                                type="datetime-local"
                                defaultValue="2017-05-24T10:30"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.handleChangeTime}
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
                    <br/><br/>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='address book icon'/>
                            New User
                        </Header>
                    </Divider>
                    <Form onSubmit={this.onSubmitUser} error={!!this.state.errorMessage2}>
                        <Select value={userType} onChange={this.handleChangeUser}
                                options={userOptions}/>
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
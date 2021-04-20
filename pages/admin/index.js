import React, {Component} from 'react';
import Layout from "../../components/Layout";
import {Button, Divider, Form, Header, Icon, Input, Message} from 'semantic-ui-react';
import Select from 'react-select';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import TextField from '@material-ui/core/TextField';

const userOptions = [
    {value: 0, label: 'Professor'},
    {value: 1, label: 'Student'},
];
const typeOptions = [
    {value: 0, label: 'File'},
    {value: 1, label: 'Link'},
];

class NewExam extends Component {

    state = {
        professor1: [''],
        professor2:'',
        student1: [''],
        student2: '',
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
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log('admin', accounts[0]);
            let profs, students;
            profs = [this.state.professor2];
            students = [this.state.student2];
            if(this.state.professor1 != ''){
                profs = [...this.state.professor2, this.state.professor1];
            }
            if(this.state.student1 != ''){
                students = [...this.state.student2, this.state.student1];
            }
            console.log('Student',this.state.student2);

            await factory.methods
                .createExam(this.state.description, this.state.type, this.state.submissionType, this.state.subject, this.state.timestamp, students, profs)
                .send({
                    from: accounts[0]
                });

        } catch (err) {
            this.setState({errorMessage1: err.message});
        }
        this.setState({loading: false});
    };

    onSubmitUser = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage2: ''});
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log(this.state.userKey);

            await factory.methods
                .createUser(this.state.userType, this.state.userKey)
                .send({
                    from: accounts[0]
                });
            console.log('hallo');
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
                            <Input value={this.state.professor2}
                                   onChange={event => this.setState({professor2: event.target.value})}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Student Address</label>
                            <Input value={this.state.student2}
                                   onChange={event => this.setState({student2: event.target.value})}
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


                            <TextField
                                id="datetime-local"
                                label="Next appointment"
                                type="datetime-local"
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

import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import {Button, Form, Input, Message, Table} from "semantic-ui-react";
import {Link, Router} from "../../../routes";
import Exam from '../../../ethereum/exam';
import web3 from "../../../ethereum/web3";
import ipfs from "../../ipfs";
import {InputFile} from "semantic-ui-react-input-file/src/InputFile";

class UploadIndex extends Component {
    state = {
        title: '',
        upload: '',
        errorMessage: '',
        buffer: '',
        hash: '',
        loading: false
    };

    static async getInitialProps(props) {
        const exam = Exam(props.query.address);
        const details = await exam.methods.getDetailsOfExam().call();
        return {
            exam,
            address: props.query.address,
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
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (this.state.title == '') {
                this.setState({title: this.state.upload})
            }
            const ipfsHASH =await ipfs.add({path:this.state.title, content:this.state.buffer}).then((response) => {
                this.setState({hash: response[0].hash});
                console.log(this.state.hash);
            });
            await exam.methods
                .submitExam(this.state.title, this.state.hash)
                .send({
                    from: accounts[0]
                });

            // Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }


    renderUploadType() {
        if (this.props.typeOfSubmission == 0) {
            return <div>
                <label>Upload File</label>
                <Input value={this.state.upload}
                       type='file'
                       onChange={event => {
                           this.setState({upload: event.target.value});
                           event.preventDefault();
                           const file = event.target.files[0];
                           const reader = new window.FileReader();
                           reader.readAsArrayBuffer(file);
                           reader.onloadend = () => {
                               this.setState({buffer: Buffer(reader.result)});
                           }
                       }}
                       action={{icon: 'upload icon'}}>
                </Input>
            </div>
        } else {
            return <div>
                <label>Upload Link</label>
                <Input value={this.state.upload}
                       onChange={event => this.setState({upload: event.target.value})}
                       action={{icon: 'link icon'}}>
                </Input></div>
        }
    }

    render() {
        return (
            <Layout>
                <h1> Exam Upload </h1>
                <h5>{this.props.subject}</h5>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Title</label>
                        <Input value={this.state.title}
                               onChange={event => this.setState({title: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        {this.renderUploadType()}
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} type='submit' primary>Upload & Save</Button>
                </Form>
            </Layout>
        );
    }
}

export default UploadIndex;

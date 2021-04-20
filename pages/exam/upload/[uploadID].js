import React, {Component} from 'react';
import Layout from "../../../components/Layout";
import {Button, Form, Input, Message} from "semantic-ui-react";
import Exam from '../../../ethereum/exam';
import ipfs from "../../api/ipfs";

class UploadIndex extends Component {
    state = {
        title: '',
        upload: '',
        errorMessage: '',
        buffer: '',
        hash: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const exam = await Exam(this.props.address);
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (this.state.title == '') {
                this.setState({title: this.state.upload})
            }
            if (this.props.typeOfSubmission == 0) {
                console.log('PDF UPLOAD');
                const ipfsHASH = await ipfs.add({
                    path: this.state.title,
                    content: this.state.buffer
                }).then((response) => {
                    this.setState({hash: response[0].hash});
                });
                await exam.methods
                    .submitExam(this.state.title, this.state.hash)
                    .send({
                        from: accounts[0]
                    });
            }else{
                console.log('LINK UPLOAD');
                await exam.methods
                    .submitExam(this.state.title, this.state.upload)
                    .send({
                        from: accounts[0]
                    });
            }
            }
        catch
            (err)
            {
                this.setState({errorMessage: err.message});
            }
            this.setState({loading: false});
        }


        renderUploadType()
        {
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

        render()
        {
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

    export

    async function

    getStaticPaths() {
        console.log('getstaticpaths');
        return {
            fallback: true,
            paths: [
                {
                    params: {
                        uploadID: '0x507db6D06C405990489c8dE1bC44500863391BE2',
                    },
                },
                {
                    params: {
                        uploadID: '0x507db6D06C405990489c8dE1bC44500863391BE2',
                    },
                }, {
                    params: {
                        uploadID: '0xC5f588298672077c28d69c287F3458ab0ADBe3A1',
                    },
                },
            ],
        }
    }

    export

    async function

    getStaticProps(context) {
        const exam = await Exam(context.params.uploadID);
        const details = await exam.methods.getDetailsOfExam().call();
        return {
            props: {
                address: context.params.uploadID,
                subject: details[1],
                typeOfSubmission: details[3],
                submissionTime: details[4],
                student: details[7],
                prof: details[8],
                status: details[9]
            }
        };
    }

    export
    default
    UploadIndex;

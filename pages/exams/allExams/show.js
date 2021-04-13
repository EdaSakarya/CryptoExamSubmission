import React, {Component} from 'react';
import {Link} from "../../../routes";
import web3 from "../../../ethereum/web3";
import factory from "../../../ethereum/factory";
import Exam from '../../../ethereum/exam';
import {Card} from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Router from "next/router";

class ShowAllOf extends Component {
    static async getInitialProps() {
        // const accounts = await web3.eth.getAccounts();
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const exams = await factory.methods.getExamsOfUser(accounts[0]).call();
        console.log(exams);
        const examDescriptions = await factory.methods.getExamsDescriptionsOfUser(accounts[0]).call();
        const admin= 0x5f2824bf7b90a38852b7765039ad6cf760c16858;
        if(accounts[0] == admin){
            Router.push('/exams/new');
        }
        return {exams, examDescriptions};
    }
    renderExams() {
        const itemAddress = this.props.exams.map(address => {
            console.log(address);
            return {
                address
            };
        });
        let i= -1;
        const items = this.props.examDescriptions.map(description => {
            i++;
            console.log('Each items address',itemAddress[i]);
            return {
                header: description,
                description: (<Link route={`/exams/${itemAddress[i].route}`}>
                    <a>View Exam</a>
                </Link>),
                fluid: true
            };
        });

        if (!items[0]) {
            return <div>'Keine Einträge'</div>
        }
        return <Card.Group items={items}/>
    }

    render() {
        return (
            <Layout>
                <h3>My Exams</h3>
                {this.renderExams()}
            </Layout>
        );
    }
}

export default ShowAllOf;

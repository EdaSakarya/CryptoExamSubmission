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
            const accounts = await web3.eth.getAccounts();
            console.log(accounts[0]);
            const exams = await factory.methods.getExamsOfUser(accounts[0]).call();
            if(accounts[0] =='0x5f2824bf7B90A38852b7765039ad6Cf760c16858'){
                Router.push('/exams/new');
            }
            return {exams};
        }
    renderExams() {
        const items = this.props.exams.map(address => {
            return {
                header: address,
                description: (<Link route={`/exams/${address}`}>
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
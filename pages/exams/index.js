import React, {Component} from 'react';
import Link from "next/link";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import {Card} from "semantic-ui-react";
import Layout from "../../components/Layout";
import accountHandler from "../api/accounts";
import examAddressHandler from "../api/allAddress";
import {useRouter} from "next/router";

class ShowAllOf extends Component {
    static async getInitialProps() {
        const accounts = await web3.eth.getAccounts();
        const exams = await examAddressHandler();
        const examDescriptions = await factory.methods.getExamsDescriptionsOfUser(accounts[0]).call();
        const admin= 0x5f2824bf7b90a38852b7765039ad6cf760c16858;

        return {exams, examDescriptions};
    }
    renderExams() {
        const itemAddress = this.props.exams.map(address => {
            return {
                address
            };
        });
        let i= -1;
        const items = this.props.examDescriptions.map(description => {
            i++;
            console.log(itemAddress[i].address);
            return {
                header: description,
                description: (<Link href={`/exam/${itemAddress[i].address}`}>
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

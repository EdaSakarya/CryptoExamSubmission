import React, {Component} from 'react';
import factory from '../ethereum/factory';
import {Card, Button} from 'semantic-ui-react';
import {Link} from '../routes';
import Layout from "../components/Layout";
import Exam from '../ethereum/exam';


class Index extends Component {
    static async getInitialProps() {
        const exams = await factory.methods.getExamsOfUser('0xCBB1BE6Ca524A4147f4bfa3D775fe095d9db2efC').call();
        const examDescription = exams.description;
        console.log(examDescription);
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
        if(!items[0]){
            return <div>'Keine Einträge'</div>
        }
        return <Card.Group items={items}/>

    }
    render() {
        return (
            <Layout>
                <div>
                    <h3>My Exams</h3>
                    {this.renderExams()}
                </div>
            </Layout>
        );
    }
}

export default Index;
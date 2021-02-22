import React, {Component} from 'react';
import {Link, Router} from '../routes';
import Layout from "../components/Layout";


class Index extends Component {
    render() {
        return (
            <Layout>
                <h2>Welcome to INDEX PAGE</h2>
                <Link route={`/exams/all`}>
                    <a>View all Exams</a>
                </Link>
            </Layout>
        );
    }
}

export default Index;
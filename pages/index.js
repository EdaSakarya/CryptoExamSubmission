import React, {Component} from 'react';
import {Link, Router} from '../routes';
import Layout from "../components/Layout";
import {Button} from 'semantic-ui-react';


class Index extends Component {
    render() {
        return (
            <Layout>
                <h2>Prüfungsleistung</h2>
                <p>Auf der nächsten Seite sind alle angemeldeten Prüfungsleistungen aufgelistet. In jeder einzelnen
                    Prüfungseinheit ist die Ansicht eines Prüfungs in Detail möglich. Es gibt die Möglichkeiten:</p>
                <li>Prüfung als Link oder PDF hochladen</li>
                <li>Prüfungen downloaden</li>
                <li>Benotung und Kommentar geben/ansehen</li>
                <li>Status des Prüfungs ansehen</li>

                <div>
                    <Button>
                        <Link route={`/exams/all`}>
                            <a>Prüfungen ansehen</a>
                        </Link>
                    </Button>
                </div>
            </Layout>
        );
    }
}

export default Index;

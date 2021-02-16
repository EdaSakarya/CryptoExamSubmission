import React from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from '../routes';

export default () => {
    return (
        <Menu style={{marginTop: '10px'}}>
            <Link route="/">
                <a className="item">
                    HS-Offenburg
                </a>
            </Link>
            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">All Exams</a>
                </Link>
                <Link route="/exams/new">
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};
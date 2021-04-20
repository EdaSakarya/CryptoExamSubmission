import React from 'react';
import {Menu} from 'semantic-ui-react';
import Link from "next/link";

export default () => {
    return (
        <Menu style={{marginTop: '10px'}}>
            <Link href="/">
                <a className="item">
                    HS-Offenburg
                </a>
            </Link>
            <Menu.Menu position="right">
                <Link href="/">
                    <a className="item">All Exams</a>
                </Link>
                <Link href="/admin">
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};

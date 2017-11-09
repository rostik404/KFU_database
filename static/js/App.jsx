import React from 'react';
import Hello from './Hello';
import { PageHeader, Button } from 'react-bootstrap';
import { Route, Router, hashHistory } from 'react-router'
import { Link } from 'react-router'
import NavBar from './navbar';

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

export default class App extends React.Component {
    render () {
        const mainForm = (
            <PageHeader>
                <div className="well" style={wellStyles}>
                    <Link to='/login' style={{ textDecoration: 'none' }}>
                        <Button bsStyle="primary" bsSize="large" block>Вход</Button>
                    </Link>
                    <Link to='/registration' style={{ textDecoration: 'none' }}>
                        <Button bsStyle="primary" bsSize="large" block style={{ margin: '10px 0' }}>Регистрация</Button>
                    </Link>
                </div>
            </PageHeader>
        )
        return localStorage.getItem('user') ? <h1>Мои Фильмы</h1> : mainForm;
    }
}

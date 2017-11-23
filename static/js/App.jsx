import React from 'react';
import { PageHeader, Button } from 'react-bootstrap';
import { Route, Router, hashHistory } from 'react-router'
import { Link } from 'react-router'
import NavBar from './navbar';
import Films from './films';

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this._showAll = this._showAll.bind(this);
        this._showForUser = this._showForUser.bind(this);
    }

    _showForUser(event) {
        event.preventDefault();

        this.setState({ forUser: true });
    }

    _showAll(event) {
        event.preventDefault();

        this.setState({ forUser: false });
    }

    render () {
        let mainForm = (
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

        if (localStorage.getItem('user')) {
            mainForm = (
                <PageHeader>
                    <div className="well" style={wellStyles}>
                        <Button onClick={this._showAll} bsStyle="primary" bsSize="large" block>Все фильмы</Button>
                        <Button onClick={this._showForUser} bsStyle="primary" bsSize="large" block style={{ margin: '10px 0' }}>Мои Фильмы</Button>
                    </div>
                </PageHeader>
            )
        }

        return (
            <div>
                {mainForm}
                <Films forUser={this.state && this.state.forUser} />
            </div>
        )
    }
}

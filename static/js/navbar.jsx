const axios = require('axios');
import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router'

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    getInitialState() {
        this.state = null;
    }

    componentWillReceiveProps(props) {
        this.componentDidMount();
    }

    componentDidMount() {
        return axios.get('/is_admin').then((res) => {
            this.setState({ isAdmin: res.data && res.data.isAdmin })
        });
    }

    _getLogin(){
        return localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).login;
    }

    _getRightPanel() {
        const logoutDiv = (
            <Nav pullRight>
                {this._isAdmin() && <NavItem><Link to='/admin' style={{ textDecoration: 'none' }}> Admin panel </Link></NavItem>}
                <NavItem><Link to='/search' style={{ textDecoration: 'none' }}> Поиск </Link></NavItem>
                <NavItem><Link to='/' style={{ textDecoration: 'none' }}> Hi, {this._getLogin()}</Link></NavItem>
                <NavItem onClick={this.logout}>Выход</NavItem>
            </Nav>
        )
        return localStorage.getItem('user')
            ? logoutDiv
            : <div />
    }

    _isAdmin(){
        return this.state && this.state.isAdmin;
    }

    logout() {
        localStorage.removeItem('user');

        return axios.post('/logout')
            .then(() => this.componentDidMount())
            .then(() => browserHistory.push('/'))
            .catch(e => console.warn(e));
    }

    render() {
        return navbarInstance.call(this);
    }
}

function navbarInstance() {
    return (
        <div >
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/' style={{ textDecoration: 'none' }}>Кинопоиск для бедных</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    {this._getRightPanel.call(this)}
                </Navbar.Collapse>
            </Navbar>
            {this.props.children}
        </div>
    );
}

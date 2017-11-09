const axios = require('axios');
import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router'

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
                <Nav>
                    <NavItem>GOTO</NavItem>
                </Nav>
                {this._getLogout()}
            </Navbar.Collapse>
        </Navbar>
        {this.props.children }
        </div>
    );
}

export default class NavBar extends React.Component {
    _getLogin(){
        return localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).login;
    }

    _getLogout() {
        const logoutDiv = (
            <Nav pullRight>
                <NavItem><Link to='/' style={{ textDecoration: 'none' }}> Hi, {this._getLogin()}</Link></NavItem>
                <NavItem onClick={this.logout}>Выход</NavItem>
            </Nav>
        )
        return localStorage.getItem('user')
            ? logoutDiv
            : <div />
    }

    logout() {
        localStorage.removeItem('user');

        return axios.post('/logout')
            .then(() => browserHistory.push('/'))
            .catch(e => console.warn(e));
    }

    render() {
        return navbarInstance.call(this);
    }
}

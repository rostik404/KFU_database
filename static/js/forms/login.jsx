const axios = require('axios');
import React from 'react';
import ReactDOM from 'react-dom';
import {
    PageHeader,
    FormGroup,
    Form,
    Col,
    Checkbox,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Label
} from 'react-bootstrap';
import { browserHistory } from 'react-router';

function formInstance() {
    return (
    <div>
        <Form horizontal method='POST' onSubmit={this.submitUser}>
            <FormGroup controlId="formHorizontalLogin">
                <Col componentClass={ControlLabel} sm={2}>
                    Login
                </Col>
                <Col sm={10}>
                    <FormControl placeholder="Login" ref="login"/>
                </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={2}>
                    Password
                </Col>
                <Col sm={10}>
                    <FormControl type="password" placeholder="Password" ref="password"/>
                </Col>
            </FormGroup>

            <FormGroup>
                <Col smOffset={2} sm={10}>
                    <Checkbox>Remember me</Checkbox>
                </Col>
            </FormGroup>

            <FormGroup>
                <Col smOffset={2} sm={10}>
                    <Button type="submit">
                        Sign in
                    </Button>
                </Col>
            </FormGroup>
        </Form>
        <div>
            <h4>
                <Label bsStyle="success">{this.state.success}</Label>
            </h4>
            <h4>
                <Label bsStyle="danger">{this.state.error}</Label>
            </h4>
        </div>
    </div>
    )
}

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.submitUser = this.submitUser.bind(this);

        this.state = {}
    }

    submitUser(event) {
        this.state = {}
        event.preventDefault();

        return axios.post('/get_user', {
            login: this._getComponentValue('login'),
            password: this._getComponentValue('password')
        }).then((res) => {
            if (res.data.err) {
                this.setState({error: res.data.err});
            } else {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                browserHistory.push('/')
            }
        })
    }

    _getComponentValue(cmpTitle) {
        return ReactDOM.findDOMNode(this.refs[cmpTitle]).value;
    }

    render() {
        return formInstance.call(this)
    }
}

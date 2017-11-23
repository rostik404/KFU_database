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
import {browserHistory} from 'react-router';
import NotificationSystem from 'react-notification-system';

export default class RegForm extends React.Component {
    constructor(props) {
        super(props);

        this.submitUser = this.submitUser.bind(this);

        this.state = {
            error: ''
        }
    }

    submitUser(event) {
        event.preventDefault();

        return axios.post('/add/user', {
            login: this._getComponentValue('login'),
            email: this._getComponentValue('email'),
            password: this._getComponentValue('password')
        }).then((res) => {
            if (res.data.err) {
                this.setState({error: res.data.err});
                setTimeout(() => browserHistory.push('/'), 3000);
            } else {
                setTimeout(browserHistory.push('/'), 3000);
            }
        })
    }

    _getComponentValue(cmpTitle) {
        return ReactDOM.findDOMNode(this.refs[cmpTitle]).value;
    }

    render() {
        return (
            <div>
                <Form horizontal method='POST' onSubmit={this.submitUser}>
                    <FormGroup controlId="formHorizontalEmail">
                        <Col componentClass={ControlLabel} sm={2}>
                            Email
                        </Col>
                        <Col sm={10}>
                            <FormControl type="email" ref="email" placeholder="Email"/>
                        </Col>
                    </FormGroup>

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
                            <Button type="submit" onClick={this.registerUser}>
                                Зарегистрироваться
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
                <div>
                    <h4>
                        <Label bsStyle="danger">{this.state.error}</Label>
                    </h4>
                </div>
            </div>
        )
    }
}

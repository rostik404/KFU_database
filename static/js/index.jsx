import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import RegForm from './forms/registration';
import LogForm from './forms/login';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import NavBar from './navbar';

ReactDOM.render(
    <div>
        <Router history={browserHistory}>
            <Route path='/' component={NavBar} >
                <IndexRoute component={App} />
                <Route path='login' component={LogForm} />
                <Route path='registration' component={RegForm} />
            </Route>
        </Router>
    </div>,
    document.getElementById('content')
);

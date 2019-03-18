import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes, { instanceOf } from 'prop-types';
import Header from './components/header';
import Login from './components/login';
import Loader from './components/loader';
import DataService from './services/index';
import { CONSTANT } from './constants/index';
import './App.css';
import './index.css'
import './style.css';

class App extends Component {
    constructor(props) {
        super(props);

        const { cookies } = props;
        let loginData = '';

        if (cookies.get('login')) {
            loginData = cookies.get('login');
        }

        this.state = {
            login: loginData,
            showLoader: false
        };
        this.loginHandler = this.loginHandler.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);

        if (loginData) {
            this.redirectOnHttps();
        } else {
            this.redirectOnHttp();
        }
    }

    loginHandler(data) {
        const { cookies } = this.props;
        this.setState({
            showLoader: true
        });
        DataService.post(CONSTANT.API_URL.LOGIN, data, (res) => {
            console.log('res', res);
            this.setState({
                showLoader: false
            });
            if (res && res.status) {
                if (res.data && res.status == CONSTANT.STATUS.SUCCESS) {
                    cookies.set("login", JSON.stringify(res.data));
                    this.redirectOnHttps();
                } else {
                    alert(res.data || 'Error in login api call.');
                }
            } else {
                alert('Error in login api call.');
            }
        })
    }

    logoutHandler() {
        const { cookies } = this.props;
        cookies.set("login", '');
        this.redirectOnHttp();
    }

    redirectOnHttps() {
        if (window.location.protocol != 'https:' && window.location.hostname != 'localhost') {
            window.location.href = 'https:' + window.location.origin.substring(window.location.protocol.length);
        }
    }

    redirectOnHttp() {
        if (window.location.protocol != 'http:' && window.location.hostname != 'localhost') {
            window.location.href = 'http:' + window.location.origin.substring(window.location.protocol.length);
        }
    }

    render() {
        if (!this.state.login) {
            return (
                <div>
                    <Login login={this.loginHandler} />
                    {this.state.showLoader && <Loader />}
                </div>
            );
        }
        return (
            <div>
                <Header logout={this.logoutHandler} />
            </div>
        );
    }
}

App.propTypes = {
    cookies: instanceOf(Cookies).isRequired
};

export default withCookies(App);

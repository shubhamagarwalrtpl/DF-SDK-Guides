import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes, { instanceOf } from 'prop-types';
import DataFornixApi from 'data-fornix-web-api';
import Header from './components/header';
import Login from './components/login';
import Loader from './components/loader';
import DataService from './services/index';
import { CONSTANT } from './constants/index';
import './App.css';
import './index.css'
import './style.css';

class App extends Component {
    apiServer = '';

    constructor(props) {
        super(props);
        this.apiServer = new DataFornixApi({token: CONSTANT.API_TOKEN, baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix}, function (res) {
            //console.log(res);
        });

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
        DataService.post(CONSTANT.API_URL.LOGIN, data, { 'Content-Type': 'application/json' }, (res) => {
            if (res && res.status) {
                if (res.data && res.status == CONSTANT.STATUS.SUCCESS) {
                    const apixObj = this.apiServer.getApixToken({ 
                        "username": CONSTANT.APIX.USERNAME,
                        "password": CONSTANT.APIX.PASSWORD 
                    });

                    apixObj.then((apixRes) => {
                        this.setState({
                            showLoader: false
                        });
                        if (apixRes && apixRes.access_token && apixRes.access_token != CONSTANT.APIX.ERROR_MSG) {
                            cookies.set("login", JSON.stringify(res.data));
                            cookies.set("access_token", apixRes.access_token);
                            this.redirectOnHttps();
                            this.setState({
                                login: JSON.stringify(res.data)
                            });
                        } else {
                            alert(CONSTANT.APIX.ERROR_MSG + ' for apix');
                        }
                    }, (error) => {
                        this.setState({
                            showLoader: false
                        });
                        console.log('apix error', error);
                        alert(error);
                    });

                    
                } else {
                    this.setState({
                        showLoader: false
                    });
                    alert(res.data || 'Error in login api call.');
                }
            } else {
                this.setState({
                    showLoader: false
                });
                alert('Error in login api call.');
            }
        })
    }

    logoutHandler() {
        const { cookies } = this.props;
        cookies.set("login", '');
        cookies.set("access_token", '');
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

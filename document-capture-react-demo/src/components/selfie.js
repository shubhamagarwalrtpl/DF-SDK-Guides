import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DataFornixApi from 'data-fornix-web-api';
import DataFornixSelfieCheck from 'data-fornix-web-selfie-check';
import { withCookies, Cookies } from 'react-cookie';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

const style = `
    .selfieMain {
        background-color: lightgray;
    }
    .selfieMain button.btn {
        background-color: #4CAF50;
    }
`;

class Selfie extends Component {
    apiServer = '';
    dataFornixSelfieCheckObj = '';

    constructor(props) {
        super(props);
        this.apiServer = new DataFornixApi(CONSTANT.API_TOKEN, function (res) {
            console.log(res);
        });
        let user_id;

        this.state = {
            showLoader: true,
            selfieObject: ''
        };

        this.selfieObjectHandler = this.selfieObjectHandler.bind(this);
        this.selfieCheckSDk = this.selfieCheckSDk.bind(this);
    }

    componentDidMount() {
        const { cookies } = this.props;
        const loginData = cookies.get('login');

        if (loginData) {
            const createUserRes = this.apiServer.createUser({
                "email": loginData.username,
                "name": loginData.name,
                "phone_number": loginData.phone_number,
                "country_code": loginData.country_code
            });
            createUserRes.then((success) => {
                console.log('User created successfully => ', success)
                this.selfieCheckSDk();
            }, (error) => {
                console.log('Error in create use => ', error);
                alert('Error in create user');
            });
        } else {
            alert('User not login');
        }
    }

    componentWillUnmount() {
        this.clearSelfieSdkState();
    }

    logout() {
        this.props.logout();
    }

    clearSelfieSdkState() {
        if (this.dataFornixSelfieCheckObj) {
            this.dataFornixSelfieCheckObj.clearState();
        }
    }

    selfieObjectHandler(res) {
        console.log(res);
        if (res && res.profile_pic) {
            this.setState({
                selfieObject: res.profile_pic,
                showLoader: true
            });
            const selfieCheckRes = this.apiServer.selfieVerify({
                profile_pic: res.profile_pic
            });
            selfieCheckRes.then((success) => {
                console.log('successfully => ', success);
                var message = success['message'] || success;
                if (typeof success === 'object' && Object.keys(success).length) {
                    Object.keys(success).forEach(function (key) {
                        var value = success[key];
                        message = key + ':' + value;
                    });
                }
                this.setState({
                    showLoader: false,
                    selfieObject: ''
                });
                alert(message);
                this.props.history.push("/");
                //this.clearSelfieSdkState();
            }, (error) => {
                console.log('Error => ', error);
                var errMessage = error['message'] || error;
                if (typeof error === 'object' && Object.keys(error).length) {
                    Object.keys(error).forEach(function (key) {
                        var value = error[key];
                        errMessage = key + ':' + value;
                    });
                }
                this.setState({
                    showLoader: false,
                    selfieObject: ''
                });
                alert(errMessage);
                //this.clearSelfieSdkState();
            });
        } else {
            alert('invalid data received by selfie-check-sdk');
        }
    }

    selfieCheckSDk() {
        this.setState({
            showLoader: false
        });
        this.dataFornixSelfieCheckObj = new DataFornixSelfieCheck({
            containerId: 'selfie-check-container',
            token: CONSTANT.SDK_TOKEN,
            style: style,
            onComplete: this.selfieObjectHandler
        });
    }

    renderSelfieCheck() {
        if (!this.state.selfieObject) {
            return (
                <div id="selfie-check-container"></div>
            );
        }
        return null;
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix: Selfie Check Demo</label>
                <div className="sidebar">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.logout}>
                                Logout
                    </a>
                        </li>
                    </ul>
                </div>
                <div className="sdk-container">
                    {this.renderSelfieCheck()}
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withRouter(withCookies(Selfie));

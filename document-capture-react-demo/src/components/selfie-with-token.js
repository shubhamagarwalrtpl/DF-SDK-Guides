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

class Selfietoken extends Component {
    apiServer = '';
    dataFornixSelfieCheckObj = '';

    constructor(props) {
        super(props);
        this.apiServer = new DataFornixApi(CONSTANT.API_TOKEN, function (res) {
            console.log(res);
        });

        this.state = {
            showLoader: true,
            selfieObject: ''
        };

        this.selfieObjectHandler = this.selfieObjectHandler.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.selfieCheckSDk = this.selfieCheckSDk.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.selfieCheckSDk();
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
        const { match: { params } } = this.props;
        if (res && res.profile_pic) {
            this.setState({
                selfieObject: res.profile_pic,
                showLoader: true
            });
            const selfieWithTokenCheckRes = this.apiServer.selfieVerifyWithToken({
                profile_pic: res.profile_pic,
                selfie_token: params.selfie_token
            });
            selfieWithTokenCheckRes.then((success) => {
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

    errorHandler(error) {
        const generateSelfieTokenRes = this.apiServer.generateSelfieToken();
        generateSelfieTokenRes.then((res) => {
            console.log('Success token creation => ', res)
            if (res && res['selfie_token']) {
                alert(`${window.location.href}/selfie-with-token/${res['selfie_token']}`)
            } else {
                alert('Something went wrong in token creation');
            }
        }, (error) => {
            console.log('Error in token creation => ', error);
            alert(error);
        });
    }

    selfieCheckSDk() {
        this.setState({
            showLoader: false
        });
        this.dataFornixSelfieCheckObj = new DataFornixSelfieCheck({
            containerId: 'selfie-check-container-1',
            token: CONSTANT.SDK_TOKEN,
            style: style,
            onComplete: this.selfieObjectHandler
        });
    }

    renderSelfieCheck() {
        if (!this.state.selfieObject) {
            return (
                <div id="selfie-check-container-1"></div>
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

export default withRouter(withCookies(Selfietoken));

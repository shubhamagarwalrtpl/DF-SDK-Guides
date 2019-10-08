import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
        this.apiServer = new DataFornixApi({token: CONSTANT.API_TOKEN, baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix}, function (res) {
            console.log(res);
        });
        let user_id;
        const { cookies } = props;
        const apixAuthToken = cookies.get('access_token');

        this.state = {
            showLoader: true,
            selfieObject: '',
            captureWithToken: '',
            apixAuthToken: apixAuthToken || ''
        };

        this.selfieObjectHandler = this.selfieObjectHandler.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.selfieCheckSDk = this.selfieCheckSDk.bind(this);
        this.getSelfieResult = this.getSelfieResult.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const { cookies } = this.props;
        const loginData = cookies.get('login');

        if (loginData) {
            const apixObj = this.apiServer.getApixToken({ 
                "username": CONSTANT.APIX.USERNAME,
                "password": CONSTANT.APIX.PASSWORD 
            });
            apixObj.then((apixRes) => {
                if (apixRes && apixRes.access_token && apixRes.access_token != CONSTANT.APIX.ERROR_MSG) {
                    cookies.set("access_token", apixRes.access_token);
                    this.setState({
                        apixAuthToken: apixRes.access_token
                    }, () => {
                        const createUserRes = this.apiServer.createUser({
                            "email": loginData.username,
                            "name": loginData.name,
                            "phone_number": loginData.phone_number,
                            "country_code": loginData.country_code,
                            "apixAuthToken": this.state.apixAuthToken
                        });
                        createUserRes.then((success) => {
                            console.log('User created successfully => ', success);
                            this.selfieCheckSDk();
                        }, (error) => {
                            console.log('Error in create use => ', error);
                            alert('Error in create user');
                        });
                    });
                } else {
                    alert(CONSTANT.APIX.ERROR_MSG + ' for apix');
                }
            }, (error) => {
                console.log('apix error', error);
                alert(error);
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
                profile_pic: res.profile_pic,
                apixAuthToken: this.state.apixAuthToken
            });
            selfieCheckRes.then((success) => {
                console.log('successfully => ', success);
                var message = success['message'] || success;
                if (typeof success === 'object' && Object.keys(success).length) {
                    Object.keys(success).forEach(function (key) {
                        var value = success[key];
                        message = key + ':' + JSON.stringify(value);
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
        const generateSelfieTokenRes = this.apiServer.generateSelfieToken({'apixAuthToken': this.state.apixAuthToken});
        generateSelfieTokenRes.then((res) => {
            console.log('Success token creation => ', res)
            if (res && res['selfie_token']) {
                //alert(`${window.location.href}/selfie-with-token/${res['selfie_token']}`)
                // this.props.history.push(`/selfie-with-token/${res['selfie_token']}`);
                this.setState({
                    captureWithToken: <Link to={{
                        pathname: `/selfie-with-token/${res['selfie_token']}`
                    }} >Capture with Token</Link>
                })
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
            containerId: 'selfie-check-container',
            token: CONSTANT.SDK_TOKEN,
            baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix,
            apixAuthToken: this.state.apixAuthToken,
            style: style,
            onComplete: this.selfieObjectHandler,
            onError: this.errorHandler
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

    getSelfieResult() {
        const selfieResultRes = this.apiServer.getSelfieResult({'apixAuthToken': this.state.apixAuthToken});
        selfieResultRes.then((success) => {
            console.log('success', success);
            var successMessage = success['message'] || success;
            alert('For asset type => ' + successMessage[0]['asset_type'] + '\n selfie math status =>' + successMessage[0]['is_user_pic_matched']);
        }, (error) => {
            console.log('error', error);
            var errMessage = error['message'] || error;
            if (typeof error === 'object' && Object.keys(error).length) {
                Object.keys(error).forEach(function (key) {
                    var value = error[key];
                    errMessage = key + ':' + value;
                });
            }
            alert(errMessage);
        });
    }

    render() {
        return (
            <div>
                <label className="page-title">
                    Data Fornix: Selfie Check Demo
                </label>
                {/* <div className="sidebar">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.getSelfieResult}>
                                Verify Selfie With Asset
                            </a>
                           <a className="nav-link" onClick={this.logout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div> */}
                <div className="sdk-container-1" style={{ textAlign: 'center' }}>
                    {this.state.captureWithToken}
                    {this.renderSelfieCheck()}
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withRouter(withCookies(Selfie));

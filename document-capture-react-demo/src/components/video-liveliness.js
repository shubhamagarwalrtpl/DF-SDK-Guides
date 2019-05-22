import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DataFornixApi from 'data-fornix-web-api';
import DfVideo from 'data-fornix-web-video-liveliness';
import { withCookies, Cookies } from 'react-cookie';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

const style = `
    .videoMain {
        background-color: lightgray;
    }
    .videoMain button.btn {
        background-color: #ff0000;
    }

    .videoMain button.record-btn {
        background-color: green;
    }
`;

class Record extends Component {
    apiServer = '';
    dataFornixVideoObj = '';

    constructor(props) {
        super(props);
        this.apiServer = new DataFornixApi(CONSTANT.API_TOKEN, function (res) {
            console.log(res);
        });
        let user_id;

        this.state = {
            currentModule: 'Video Liveliness',
            showLoader: true,
            videoObject: ''
        };

        this.videoLiveLinessSDK = this.videoLiveLinessSDK.bind(this);
        this.videoObjectHandler = this.videoObjectHandler.bind(this);
        this.clearVideoSdkState = this.clearVideoSdkState.bind(this);

        /* this.state = {
            showIntro: true,
            showVideo: false
        } */

        /* this.showVideo = this.showVideo.bind(this);

        this.onTurnOnCamera = this.onTurnOnCamera.bind(this);
        this.onTurnOffCamera = this.onTurnOffCamera.bind(this);
        this.onStartRecording = this.onStartRecording.bind(this);
        this.onStopRecording = this.onStopRecording.bind(this);
        this.onRecordingComplete = this.onRecordingComplete.bind(this);
        this.onOpenVideoInput = this.onOpenVideoInput.bind(this);
        this.onStopReplaying = this.onStopReplaying.bind(this);
        this.onError = this.onError.bind(this); */
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
                this.videoLiveLinessSDK();
            }, (error) => {
                console.log('Error in create use => ', error);
                alert('Error in create user');
            });
        } else {
            alert('User not login');
        }
    }

    /* onTurnOnCamera(res) {
        console.log('onTurnOnCamera', res)
    }

    onTurnOffCamera(res) {
        console.log('onTurnOffCamera', res)
    }

    onStartRecording(res) {
        console.log('onStartRecording', res)
    }

    onStopRecording(res) {
        console.log('onStopRecording', res)
    }

    onRecordingComplete(res) {
        console.log('onRecordingComplete', res)
    }

    onOpenVideoInput(res) {
        console.log('onOpenVideoInput', res)
    }

    onStopReplaying(res) {
        console.log('onStopReplaying', res)
    }

    onError(res) {
        console.log('onError', res)
    }

    showVideo() {
        this.setState({
            showIntro: false,
            showVideo: true
        });
    }

    renderIntro() {
        if (!this.state.showVideo && this.state.showIntro) {
            return (
                <div>
                    Introducation of Video liveliness
                    <button type="button" onClick={this.showVideo}>Start</button>
                </div>
            );
        }
    } */

    componentWillUnmount() {
        this.clearVideoSdkState();
    }

    clearVideoSdkState() {
        if (this.dataFornixVideoObj) {
            this.dataFornixVideoObj.clearState();
        }
    }

    getResMessage(res) {
        let message = res;
        if (res && typeof res === 'object' && Object.keys(res).length) {
            Object.keys(res).forEach(function (key) {
                message = key + ':' + res[key];
            });
        }
        return message;
    }

    videoObjectHandler(obj) {
        console.log('video object=> ', obj);
        if (obj.status) {
            this.setState({
                showLoader: true
            });
            const videoLivelinessApiRes = this.apiServer.checkVideo(obj);
            videoLivelinessApiRes.then((success) => {
                console.log('User created successfully => ', success);
                this.setState({
                    showLoader: false
                });
                alert(this.getResMessage(success) || 'success');
                this.props.history.push("/");
            }, (error) => {
                console.log('Error in create use => ', error);
                this.setState({
                    showLoader: false
                });
                // alert(this.getResMessage(error) || 'error');
                this.videoRetry(this.getResMessage(error) || 'error');
            });
        } else {
            // alert('Text match error');
            this.videoRetry('Text match error');
        }
    }

    videoRetry(msg) {
        if (window.confirm(msg)) {
            if (this.dataFornixVideoObj) {
                this.dataFornixVideoObj.clearState();
                this.videoLiveLinessSDK();
            }
        } else {
            alert("You pressed Cancel!");
        }
    }

    videoLiveLinessSDK() {
        this.setState({
            showLoader: false
        });
        this.dataFornixVideoObj = new DfVideo({
            containerId: 'video-container',
            token: CONSTANT.SDK_TOKEN,
            style: style,
            onComplete: this.videoObjectHandler
        });
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix: {this.state.currentModule}</label>
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
                    <div id="video-container"></div>
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withRouter(withCookies(Record));

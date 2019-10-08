import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import DataFornixApi from 'data-fornix-web-api';
import { CONSTANT } from './../constants/index';
import DataService from '../services/index';
import Loader from './loader';

const styles = {
    option_div: {
        padding: "5px"
    },
    env_dropdown: {
        width: "25%",
        marginRight: "6px",
        display: "inline-block"
    },
    file_option: {
        width: "25%",
        marginRight: "6px",
        display: "inline-block"
    },
    type_dropdown: {
        width: "30%",
        display: "inline-block"
    },
    env_url: {
        width: "70%",
        marginRight: "6px",
        background: "none"
    },
    send_button: {
        width: "10%"
    },
    response_div: {
        border: "1px solid #aaaaaa",
        margin: "5px",
        background: "#fff",
        fontSize: "15px"
    }
}

class DocumentCapture extends Component {

    constructor(props) {
        super(props);

        this.apiServer = new DataFornixApi({token: CONSTANT.API_TOKEN, baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix}, function (res) {
            //console.log(res);
        });

        this.state = {
            environment: 'prod',
            responseJson: '{}',
            showLoader: false,
            front_image: null,
            back_image: null,
            data: {
                "document_type": CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD,
                "channel": "web",
                "reference_number": "123",
                "type_of_request": "get OCR"
            }
        };
    }

    componentWillUnmount() {
        this.setState({
            environment: 'prod',
            responseJson: '{}',
            showLoader: false
        });
    }

    envChangeHandler = (event) => {
        this.setState({
            environment: event.target.value
        });
    }

    typeChangeHandler = (event) => {
        this.setState({
            data: { ...this.state.data, ...{ 'document_type': event.target.value } }
        });
    }

    fileHandler = (fileType, e) => {
        e.preventDefault();
        if (e && e.target && e.target.files.length) {
            const reader = new FileReader();

            reader.onloadend = () => {
                this.setState({
                    [fileType]: reader.result
                });
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            this.setState({
                [fileType]: ''
            });
        }
    }

    submitHandler = () => {
        if (!this.state.front_image
            || (this.state.data.document_type != CONSTANT.DOCUMENT_TYPE.PASSPORT && !this.state.back_image)) {
            alert('Provide valid data before api call');
            return;
        }

        this.setState({
            showLoader: true
        });

        DataService.post(
            `${CONSTANT.ENVIRONVEMENT_BASE_URL[this.state.environment]}${CONSTANT.API_URL.CREATE_USER_TOKEN}`,
            {
                "user_token": "12345a",
                "channel": "web",
                "reference_number": "web",
                "type_of_request": "aync"
            },
            {
                "Content-Type": "application/json",
                "api_token": (this.state.environment == 'prod') ? CONSTANT.API_TOKEN_PROD : CONSTANT.API_TOKEN,
            },
            (res) => {
                if (res && res.status) {
                    if (res.data && res.status == CONSTANT.STATUS.SUCCESS) {
                        const image = [];
                        image[0] = {
                            "authority": "AE",
                            "description": "Front",
                            "image_string": this.state.front_image
                        };
                        if (this.state.data.document_type == CONSTANT.DOCUMENT_TYPE.PASSPORT) {
                            image[1] = {
                                "authority": "AE",
                                "description": "Back",
                                "image_string": null
                            };
                        } else {
                            image[1] = {
                                "authority": "AE",
                                "description": "Back",
                                "image_string": this.state.back_image
                            };
                        }
                        const data = { ...this.state.data, ...{ images: image } };
                        const header = {
                            'auth_token': res.data.auth_token,
                            'api_token': (this.state.environment == 'prod') ? CONSTANT.API_TOKEN_PROD : CONSTANT.API_TOKEN,
                            'Content-Type': 'application/json'
                        };

                        DataService.post(
                            `${CONSTANT.ENVIRONVEMENT_BASE_URL[this.state.environment]}${CONSTANT.API_URL.GET_OCR}`,
                            data,
                            header,
                            (res) => {
                                this.setState({
                                    showLoader: false
                                });
                                if (res && res.status) {
                                    if (res.data && res.status == CONSTANT.STATUS.SUCCESS) {
                                        this.setState({
                                            responseJson: JSON.stringify(res.data, null, 2)
                                        });
                                    } else {
                                        this.setState({
                                            responseJson: '{}'
                                        });
                                        alert(JSON.stringify(res.data) || 'Error in login api call.');
                                    }
                                } else {
                                    this.setState({
                                        responseJson: '{}'
                                    });
                                    alert('Error in api call.');
                                }
                            })

                    } else {
                        this.setState({
                            showLoader: false,
                            responseJson: '{}'
                        });
                        console.log('Error in create use => ', res);
                        alert(JSON.stringify(res.data) || 'Error in login api call.');
                    }
                } else {
                    this.setState({
                        showLoader: false,
                        responseJson: '{}'
                    });
                    alert('Error in api call.');
                }
            });
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix: Document Capture Verify</label>
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
                    <div style={styles.option_div}>
                        <div style={styles.env_dropdown}>
                            <label>Select Environment</label>
                            <select onChange={this.envChangeHandler}>
                                <option value='prod'>Prod</option>
                                <option value='qat'>Qat</option>
                            </select>
                        </div>
                        <div style={styles.type_dropdown}>
                            <label>Select Document Type</label>
                            <select onChange={this.typeChangeHandler}>
                                <option value={CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD}>{CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD}</option>
                                <option value={CONSTANT.DOCUMENT_TYPE.PASSPORT}>{CONSTANT.DOCUMENT_TYPE.PASSPORT}</option>
                                <option value={CONSTANT.DOCUMENT_TYPE.DRIVING_LICENCE}>{CONSTANT.DOCUMENT_TYPE.DRIVING_LICENCE}</option>
                            </select>
                        </div>
                    </div>
                    <div style={styles.option_div}>
                        <div style={styles.file_option}>
                            <label>First Image</label>
                            <input type='file' onChange={(e) => this.fileHandler('front_image', e)} />
                        </div>
                        {this.state.data.document_type != CONSTANT.DOCUMENT_TYPE.PASSPORT && <div style={styles.file_option}>
                            <label>Back Image</label>
                            <input type='file' onChange={(e) => this.fileHandler('back_image', e)} />
                        </div>
                        }
                    </div>
                    <div style={styles.option_div}>
                        <input style={styles.env_url} type="text" disabled value={`${CONSTANT.ENVIRONVEMENT_BASE_URL[this.state.environment]}${CONSTANT.API_URL.GET_OCR}`} />
                        <input style={styles.send_button} onClick={this.submitHandler} type="button" value="Send" />
                    </div>
                    <div style={styles.response_div}>
                        <pre>{this.state.responseJson}</pre>
                    </div>
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withRouter(withCookies(DocumentCapture));

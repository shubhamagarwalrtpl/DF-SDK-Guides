import React, { Component } from 'react';
import DataFornixApi from 'data-fornix-api';
import DataFornixDC from 'data-fornix-dc';
import { withCookies, Cookies } from 'react-cookie';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

class Home extends Component {
    apiServer = '';
    dataFornixWeb = '';

    constructor(props) {
        super(props);
        this.apiServer = new DataFornixApi(CONSTANT.API_TOKEN, function (res) {
            console.log(res);
        });
        let user_id;

        const { cookies } = props;
        const loginData = cookies.get('login');

        if (loginData) {
            const createUserRes = this.apiServer.createUser({
                "email": loginData.username,
                "name": loginData.name,
                "phone_number": loginData.phone_number,
                "country_code": loginData.country_code
            });
            createUserRes.then(function (success) {
                console.log('User created successfully => ', success)
            }, function (error) {
                console.log('Error in create use => ', error);
            });
        } else {
            alert('User not login');
        }

        this.state = {
            currentTab: 0,
            documentType: 'Driving Licence',
            sdkCapturedDocument: '',
            apiCapturedDocument: '',
            showLoader: false
        };

        this.logout = this.logout.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.nextHandler = this.nextHandler.bind(this);
        this.updateTab = this.updateTab.bind(this);
        this.renderDocumentCaptureSdk = this.renderDocumentCaptureSdk.bind(this);
        this.renderDocumentCapturedData = this.renderDocumentCapturedData.bind(this);
    }

    componentDidMount() {
        /*  */
    }

    logout() {
        this.props.logout();
    }

    changeHandler(key, value) {
        this.setState({
            [key]: value
        });
    }

    formChangeHandler(key, value) {
        const formCurrentVal = {...this.state.apiCapturedDocument};
        formCurrentVal[key] = value;
        this.setState({
            apiCapturedDocument: formCurrentVal
        }, () => {
            console.log('this.state', this.state.apiCapturedDocument);
        });
    }

    nextHandler(tab) {
        if (tab == 1) {
            if (this.state.documentType) {
                this.updateTab(tab);
            } else {
                alert('Please select document type');
            }
        } else if (tab == 2) {
            this.setState({
                showLoader: true
            });
            if (this.state.sdkCapturedDocument
                && this.state.sdkCapturedDocument.asset_type
                && this.state.sdkCapturedDocument.front_image
                && this.state.sdkCapturedDocument.back_image !== undefined) {
                const documentDataCapturePromise = this.apiServer.documentDataCapture(this.state.sdkCapturedDocument);
                documentDataCapturePromise.then((res) => {
                    console.log('User document captured data => ', res);
                    const apiCapturedDocument = res['properties'];
                    if (apiCapturedDocument && apiCapturedDocument['identity_number']) {
                        apiCapturedDocument['identity_number'] = apiCapturedDocument['identity_number'].replace(/ /g,'').replace(/^(.{4})(.{4})(.*)$/, "$1 $2 $3");
                    }
                    apiCapturedDocument['asset_type'] = res['asset_type'];
                    this.setState({
                        apiCapturedDocument,
                        showLoader: false
                    }, () => {
                        this.updateTab(tab);
                    });
                }, (error) => {
                    console.log('Error in capture data api => ', error);
                    var errMessage = error['message'] || error;
                    if (typeof error === 'object' && Object.keys(error).length) {
                        Object.keys(error).forEach(function (key) {
                            var value = error[key];
                            errMessage = key + ':' + value;
                        });
                    }
                    this.setState({
                        showLoader: false
                    });
                    alert(errMessage);
                    if (this.dataFornixWeb) {
                        this.dataFornixWeb.clearState();
                    }
                    this.updateTab(0);
                });
            } else {
                alert('Invalid data provide');
                this.setState({
                    showLoader: false
                });
            }
        } else if (tab == 3) {
            if (this.state.apiCapturedDocument) {
                this.setState({
                    showLoader: true
                });
                const capturedDocumentSavePromise = this.apiServer.documentDataSave(this.state.apiCapturedDocument);
                capturedDocumentSavePromise.then((res) => {
                    console.log('Captured data saved successfully => ', res)
                    this.setState({
                        showLoader: false
                    });
                    alert('Data saved successfully');
                    if (this.dataFornixWeb) {
                        this.dataFornixWeb.clearState();
                    }
                    this.updateTab(0);
                }, (error) => {
                    console.log('Error in create use => ', error);

                    var errMessage2 = error;
                    if (typeof error === 'object' && Object.keys(error).length) {
                        Object.keys(error).forEach(function (key) {
                            var value = error[key];
                            errMessage2 = key + ':' + value;
                        });
                    }
                    this.setState({
                        showLoader: false
                    });
                    alert(errMessage2);
                    if (this.dataFornixWeb) {
                        this.dataFornixWeb.clearState();
                    }
                    this.updateTab(0);
                });
            } else {
                alert('Invalid data captured');
                this.setState({
                    showLoader: false
                });
            }
        }
    }

    updateTab(tab) {
        this.setState({
            currentTab: tab
        }, () => {
            if (tab == 1) {
                this.renderDocumentCaptureSdk();
            }
        });
    }

    renderDocumentCaptureSdk() {
        let isBackCapture = false;
        if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.DRIVING_LICENCE
            || this.state.documentType == CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD
            || this.state.documentType == CONSTANT.DOCUMENT_TYPE.PAN_CARD) {
            isBackCapture = true;
        }
        var firstTitle = 'Front of Licence',
            firstPlaceholder = 'Drag front of licence..',
            secondTitle = 'Back of Licence',
            secondPlaceholder = 'Drag back of licence..';

        if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD) {
            firstTitle = 'Front of Identity Card';
            firstPlaceholder = 'Drag front of identity card..';
            secondTitle = 'Back of Identity Card';
            secondPlaceholder = 'Drag back of identity card..';
        } else if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.PASSPORT) {
            firstTitle = 'Passport';
            firstPlaceholder = 'Drag your passport here..';
        } else if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.PAN_CARD) {
            firstTitle = 'Front of PAN Card';
            firstPlaceholder = 'Drag front of pan card..';
            secondTitle = 'Back of PAN Card';
            secondPlaceholder = 'Drag back of pan card..';
        }
        this.dataFornixWeb = new DataFornixDC({
            containerId: 'documentCapture',
            token: CONSTANT.SDK_TOKEN,
            documentBackCapture: isBackCapture,
            uiOptions: {
                'backgroundColor': '#fff', //'#ff0000'
                'firstInputTitle': firstTitle,
                'firstInputPlaceholder': firstPlaceholder,
                'secondInputTitle': secondTitle,
                'secondInputPlaceholder': secondPlaceholder,
                'useCamera': true
            },
            onComplete: (res) => {
                this.setState({
                    sdkCapturedDocument: {
                        'asset_type': this.state.documentType,
                        'front_image': res.frontFile,
                        'back_image': res.backFile
                    }
                }, () => {
                    console.log('Droped documents', this.state.sdkCapturedDocument);
                });
            }
        });
    }

    renderDocumentOptions() {
        if (this.state.currentTab == 0) {
            return (
                <div className="tab">
                    <label className="custom-radio">
                        Driving Licence
                        <input type="radio"
                            checked={this.state.documentType === 'Driving Licence'}
                            name="document"
                            value="Driving Licence"
                            onChange={() => this.changeHandler('documentType', 'Driving Licence')} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        Identity Card
                        <input type="radio"
                            checked={this.state.documentType === 'Identity Card'}
                            name="document"
                            value="Identity Card"
                            onChange={() => this.changeHandler('documentType', 'Identity Card')} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        PAN Card
                        <input type="radio"
                            checked={this.state.documentType === 'PAN Card'}
                            name="document"
                            value="PAN Card"
                            onChange={() => this.changeHandler('documentType', 'PAN Card')} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        Passport
                        <input type="radio"
                            checked={this.state.documentType === 'Passport'}
                            name="document"
                            value="Passport"
                            onChange={() => this.changeHandler('documentType', 'Passport')} />
                        <span className="checkmark"></span>
                    </label>
                    <div style={{ overflow: 'auto' }}>
                        <div style={{ float: 'right' }}>
                            <button onClick={() => this.nextHandler(1)} type="button" id="nextBtn">Next</button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    renderDocumentCapture() {
        if (this.state.currentTab == 1) {
            return (
                <div className="tab">
                    <div id="documentCapture"></div>
                    <div style={{ overflow: 'auto' }}>
                        <div style={{ float: 'right' }}>
                            <button onClick={() => this.nextHandler(2)} type="button" id="nextBtn">Next</button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    renderDocumentCapturedData() {
        if (this.state.currentTab == 2) {
            console.log('this.state.apiCapturedDocument',this.state.apiCapturedDocument)
            return (
                <div className="tab submitFormFields">
                    <strong>User Info:</strong>
                    <p>
                        Asset Type
                        <input readOnly placeholder="Asset Type" data-required="true" id="asset_type" value={this.state.apiCapturedDocument.asset_type} onChange={(event) => this.formChangeHandler('asset_type', event.target.value)} />
                    </p>
                    {this.state.documentType == CONSTANT.DOCUMENT_TYPE.PASSPORT &&
                        (
                            <p className="passport_number">
                                Passport Number
                                <input type="text" placeholder="passport number" id="passport_number" value={this.state.apiCapturedDocument.passport_number} onChange={(event) => this.formChangeHandler('passport_number', event.target.value)} />
                            </p>
                        )
                    }
                    {(this.state.documentType == CONSTANT.DOCUMENT_TYPE.DRIVING_LICENCE) && 
                        <p className="licence_number">
                            Licence Number
                            <input type="text" placeholder="licence number" id="licence_number" value={this.state.apiCapturedDocument.licence_number} onChange={(event) => this.formChangeHandler('licence_number', event.target.value)} />
                        </p>
                    }
                    {this.state.documentType == CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD && 
                        (
                            <p className="identity_number">
                                Identity Number
                                <input type="text" placeholder="identity number" id="identity_number" value={this.state.apiCapturedDocument.identity_number} onChange={(event) => this.formChangeHandler('identity_number', event.target.value)} />
                            </p>
                        )
                    }
                    {this.state.documentType == CONSTANT.DOCUMENT_TYPE.PAN_CARD &&
                        (
                            <p className="pan_number">
                                PAN Number
                                <input type="text" placeholder="pan number" id="pan_number" value={this.state.apiCapturedDocument.pan_number} onChange={(event) => this.formChangeHandler('pan_number', event.target.value)} />
                            </p>
                        )
                    }
                    <p>
                        First Name
                        <input placeholder="First Name" data-required="true" id="first_name" value={this.state.apiCapturedDocument.first_name} onChange={(event) => this.formChangeHandler('first_name', event.target.value)} />
                    </p>
                    {this.state.apiCapturedDocument.middle_name &&
                        <p>
                            Middle Name
                            <input placeholder="First Name" data-required="true" id="middle_name" value={this.state.apiCapturedDocument.middle_name} onChange={(event) => this.formChangeHandler('middle_name', event.target.value)} />
                        </p>
                    }
                    <p>
                        Last Name
                        <input placeholder="Last Name" data-required="true" id="last_name" value={this.state.apiCapturedDocument.last_name} onChange={(event) => this.formChangeHandler('last_name', event.target.value)} />
                    </p>
                    {this.state.apiCapturedDocument.gender &&
                        <p className="gender">
                            Gender
                            <select name="gender" id="gender" value={this.state.apiCapturedDocument.gender} onChange={(event) => this.formChangeHandler('gender', event.target.value)}>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </p>
                    }
                    <p className="address">Address
                        <textarea placeholder="Address" id="address" value={this.state.apiCapturedDocument.address  || ''} onChange={(event) => this.formChangeHandler('address', event.target.value)}></textarea>
                    </p>
                    <p className="birth_date">
                        DOB
                        <input placeholder="DOB" type="date" id="birth_date" value={this.state.apiCapturedDocument.birth_date || ''} onChange={(event) => this.formChangeHandler('birth_date', event.target.value)} />
                    </p>
                    {this.state.apiCapturedDocument.father_name &&
                        <p className="father_name">
                            Father Name
                            <input placeholder="father name" type="text" id="father_name" value={this.state.apiCapturedDocument.father_name} onChange={(event) => this.formChangeHandler('father_name', event.target.value)} />
                        </p>
                    }
                    <p className="issue_date">
                        Issue Date
                        <input placeholder="Expire Date" type="date" id="issue_date" value={this.state.apiCapturedDocument.issue_date || ''} onChange={(event) => this.formChangeHandler('issue_date', event.target.value)} />
                    </p>
                    <p className="expiry_date">
                        Expiry Date
                        <input placeholder="Expire Date" type="date" id="expiry_date" value={this.state.apiCapturedDocument.expiry_date || ''} onChange={(event) => this.formChangeHandler('expiry_date', event.target.value)} />
                    </p>
                    {this.state.apiCapturedDocument.state &&
                        <p className="state">
                            State
                            <input placeholder="State" type="text" id="state" value={this.state.apiCapturedDocument.state} onChange={(event) => this.formChangeHandler('state', event.target.value)} />
                        </p>
                    }
                    <p>
                        Nationality
                        <input placeholder="Nationality" data-required="true" id="nationality" value={this.state.apiCapturedDocument.nationality} onChange={(event) => this.formChangeHandler('nationality', event.target.value)} />
                    </p>

                    <div style={{ overflow: 'auto' }}>
                        <div style={{ float: 'right' }}>
                            <button onClick={() => this.nextHandler(3)} type="button" id="nextBtn">Next</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix: Document Capture Demo</label>
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
                    {this.renderDocumentOptions()}
                    {this.renderDocumentCapture()}
                    {this.renderDocumentCapturedData()}
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withCookies(Home);

import React, { Component } from 'react';
import DataFornixApi from 'data-fornix-web-api';
import DataFornixDC from 'data-fornix-web-dc';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

class Home extends Component {
    apiServer = '';
    dataFornixWeb = '';

    constructor(props) {
        super(props);

        // initialize API SDK
        this.apiServer = new DataFornixApi(CONSTANT.API_TOKEN, function (res) {
            console.log(res);
        });

        // Create user first before API sdk other method call
        // All captured data will be save for this user
        const createUserRes = this.apiServer.createUser({
            "email": CONSTANT.USER.EMAIL,
            "name": CONSTANT.USER.NAME,
            "phone_number": CONSTANT.USER.PHONE,
            "country_code": CONSTANT.USER.COUNTRY_CODE
        });
        createUserRes.then(function (success) {
            console.log('User created successfully, now all data will save for this user => ', success)
        }, function (error) {
            console.log('Error in create use => ', error);
        });

        this.state = {
            currentTab: 0,
            documentType: 'Driving Licence',
            sdkCapturedDocument: '',
            apiCapturedDocument: '',
            showLoader: false
        };

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

    changeHandler(key, value) {
        this.setState({
            [key]: value
        });
    }

    formChangeHandler(key, value) {
        const formCurrentVal = { ...this.state.apiCapturedDocument };
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
                    if (apiCapturedDocument && apiCapturedDocument['identity_number'] && apiCapturedDocument['nationality'] && apiCapturedDocument['nationality'] == 'India') {
                        apiCapturedDocument['identity_number'] = apiCapturedDocument['identity_number'].replace(/ /g, '').replace(/^(.{4})(.{4})(.*)$/, "$1 $2 $3");
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
        var firstTitle = CONSTANT.SDK_TITLES.LICENCE.FIRST_TITLE,
            firstPlaceholder = CONSTANT.SDK_TITLES.LICENCE.FIRST_PLACEHOLDER,
            secondTitle = CONSTANT.SDK_TITLES.LICENCE.SECOND_TITLE,
            secondPlaceholder = CONSTANT.SDK_TITLES.LICENCE.SECOND_PLACEHOLDER;

        if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.PASSPORT) {
            firstTitle = CONSTANT.SDK_TITLES.PASSPORT.FIRST_TITLE;
            firstPlaceholder = CONSTANT.SDK_TITLES.PASSPORT.FIRST_PLACEHOLDER;
        }

        this.dataFornixWeb = new DataFornixDC({
            containerId: 'documentCapture',
            token: CONSTANT.SDK_TOKEN,
            documentBackCapture: isBackCapture,
            uiOptions: {
                // You can use your own style here
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
                        Passport
                        <input type="radio"
                            checked={this.state.documentType === 'Passport'}
                            name="document"
                            value="Passport"
                            onChange={() => this.changeHandler('documentType', 'Passport')} />
                        <span className="checkmark"></span>
                    </label>
                    <div style={{ overflow: 'auto' }}>
                        <div>
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
                        <div>
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
            console.log('this.state.apiCapturedDocument', this.state.apiCapturedDocument)
            return (
                <div className="tab submitFormFields">
                    <strong>Captured Info:</strong>
                    <p>
                        Asset Type
                        <input readOnly placeholder="Asset Type" data-required="true" id="asset_type" value={this.state.apiCapturedDocument.asset_type} onChange={(event) => this.formChangeHandler('asset_type', event.target.value)} />
                    </p>
                    {(this.state.documentType == CONSTANT.DOCUMENT_TYPE.PASSPORT || this.state.documentType == CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK) &&
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
                    {this.state.apiCapturedDocument.address &&
                        (
                            <p className="address">Address
                        <textarea placeholder="Address" id="address" value={this.state.apiCapturedDocument.address || ''} onChange={(event) => this.formChangeHandler('address', event.target.value)}></textarea>
                            </p>
                        )
                    }
                    {this.state.documentType != CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK &&
                        (
                            <p className="birth_date">
                                DOB
                        <input placeholder="DOB" type="date" id="birth_date" value={this.state.apiCapturedDocument.birth_date || ''} onChange={(event) => this.formChangeHandler('birth_date', event.target.value)} />
                            </p>
                        )
                    }
                    {this.state.apiCapturedDocument.father_name &&
                        <p className="father_name">
                            Father Name
                            <input placeholder="father name" type="text" id="father_name" value={this.state.apiCapturedDocument.father_name} onChange={(event) => this.formChangeHandler('father_name', event.target.value)} />
                        </p>
                    }
                    {(this.state.apiCapturedDocument.issue_date) &&
                        (
                            <p className="issue_date">
                                Issue Date
                                <input placeholder="Issue Date" type="date" id="issue_date" value={this.state.apiCapturedDocument.issue_date || ''} onChange={(event) => this.formChangeHandler('issue_date', event.target.value)} />
                            </p>
                        )
                    }
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
                    {this.state.documentType != CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK &&
                        (
                            <p>
                                Nationality
                                <input placeholder="Nationality" data-required="true" id="nationality" value={this.state.apiCapturedDocument.nationality} onChange={(event) => this.formChangeHandler('nationality', event.target.value)} />
                            </p>
                        )
                    }
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix: Document Capture Demo</label>
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

export default Home;

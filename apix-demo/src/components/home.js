import React, { Component } from 'react';
import DataFornixApi from 'data-fornix-web-api';
import DataFornixDC from 'data-fornix-web-dc';
import { withCookies, Cookies } from 'react-cookie';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

class Home extends Component {
    apiServer = '';
    dataFornixWeb = '';

    constructor(props) {
        super(props);
        this.apiServer = new DataFornixApi({token: CONSTANT.API_TOKEN, baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix}, function (res) {
            //console.log(res);
        });
        let user_id;

        const { cookies } = props;
        const apixAuthToken = cookies.get('access_token');

        this.state = {
            currentTab: 0,
            documentType: 'Driving Licence',
            sdkCapturedDocument: '',
            apiCapturedDocument: '',
            image_quality_feedback: '',
            image_feedback: '',
            showLoader: false,
            apixAuthToken: apixAuthToken || ''
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
                            "apixAuthToken": apixRes.access_token
                        });
                        createUserRes.then(function (success) {
                            console.log('User created successfully => ', success)
                        }, function (error) {
                            console.log('Error in create use => ', error);
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

    logout() {
        this.props.logout();
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
                const documentDataCapturePromise = this.apiServer.documentDataCapture({ ...this.state.sdkCapturedDocument, "apixAuthToken": this.state.apixAuthToken});
                documentDataCapturePromise.then((res) => {
                    console.log('User document captured data => ', res);
                    const apiCapturedDocument = res['properties'];
                    if (apiCapturedDocument && apiCapturedDocument['identity_number'] && apiCapturedDocument['nationality'] && apiCapturedDocument['nationality'] == 'India') {
                        // apiCapturedDocument['identity_number'] = apiCapturedDocument['identity_number'].replace(/ /g, '').replace(/^(.{4})(.{4})(.*)$/, "$1 $2 $3");
                    }
                    apiCapturedDocument['asset_type'] = res['asset_type'];
                    this.setState({
                        apiCapturedDocument,
                        image_quality_feedback: res['image_quality_feedback'] || "",
                        image_feedback: res['image_feedback'] || "",
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
                            errMessage = key + ':' + JSON.stringify(value);
                        });
                    }
                    this.setState({
                        showLoader: false
                    });
                    alert(JSON.stringify(errMessage));
                    console.log('===>', this.state.apixAuthToken)
                    if (this.dataFornixWeb) {
                        this.dataFornixWeb.clearState();

                        this.dataFornixWeb = new DataFornixDC({
                            containerId: 'documentCapture',
                            token: CONSTANT.SDK_TOKEN,
                            baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix,
                            apixAuthToken: this.state.apixAuthToken,
                            documentBackCapture: false,
                            uiOptions: {
                                'backgroundColor': '#fff', //'#ff0000'
                                'firstInputTitle': 'firstTitle',
                                'firstInputPlaceholder': 'firstPlaceholder',
                                'secondInputTitle': 'secondTitle',
                                'secondInputPlaceholder': 'secondPlaceholder',
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
                                    console.log('==>', this.state.sdkCapturedDocument)
                                });
                            }
                        });
                    }
                    //this.updateTab(0);
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
                const capturedDocumentSavePromise = this.apiServer.documentDataSave({ ...this.state.apiCapturedDocument, "apixAuthToken": this.state.apixAuthToken });
                capturedDocumentSavePromise.then((res) => {
                    //console.log('Captured data saved successfully => ', res)
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
                    alert(JSON.stringify(errMessage2));
                    if (this.dataFornixWeb) {
                        this.dataFornixWeb.clearState();
                    }
                    //this.updateTab(0);
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
            || this.state.documentType == CONSTANT.DOCUMENT_TYPE.PAN_CARD
            || this.state.documentType == CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION) {
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
        } else if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK) {
            firstTitle = 'Visa Card';
            firstPlaceholder = 'Drag visa card here..';
        } else if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.GASS_BILL) {
            firstTitle = 'Gass Bill';
            firstPlaceholder = 'Drag your gass bill here..';
        } else if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.ADDRESS_PROOF) {
            firstTitle = 'Address Proff';
            firstPlaceholder = 'Drag your address proff document here..';
        } else if (this.state.documentType == CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION) {
            firstTitle = 'Vehicle Registration Front';
            firstPlaceholder = 'Drag your document here..';
            secondTitle = 'Vehicle Registration Back';
            secondPlaceholder = 'Drag your document here..';
        }
        console.log('this.state.apixAuthToken', this.state.apixAuthToken)
        this.dataFornixWeb = new DataFornixDC({
            containerId: 'documentCapture',
            token: CONSTANT.SDK_TOKEN,
            documentBackCapture: isBackCapture,
            baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix,
            apixAuthToken: this.state.apixAuthToken,
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
                    console.log('==>', this.state.sdkCapturedDocument)
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
                    {/* <label className="custom-radio">
                        Visa
                        <input type="radio"
                            checked={this.state.documentType === 'Is Right To Work'}
                            name="document"
                            value="Is Right To Work"
                            onChange={() => this.changeHandler('documentType', 'Is Right To Work')} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        GASS BILL
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.GASS_BILL}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.GASS_BILL}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.GASS_BILL)} />
                        <span className="checkmark"></span>
                    </label> */}
                    <label className="custom-radio">
                        Address Proof
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.ADDRESS_PROOF}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.ADDRESS_PROOF}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.ADDRESS_PROOF)} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        SF50
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.SF50}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.SF50}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.SF50)} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        Vehicle Registration
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION)} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        wages allotment
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.WageAllotment}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.WageAllotment}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.WageAllotment)} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        W2 Form
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.W2Form}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.W2Form}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.W2Form)} />
                        <span className="checkmark"></span>
                    </label>
                    <label className="custom-radio">
                        Pay Slip
                        <input type="radio"
                            checked={this.state.documentType === CONSTANT.DOCUMENT_TYPE.PaySlip}
                            name="document"
                            value={CONSTANT.DOCUMENT_TYPE.PaySlip}
                            onChange={() => this.changeHandler('documentType', CONSTANT.DOCUMENT_TYPE.PaySlip)} />
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

    renderFiles(files) {
        if (files && Array.isArray(files)) {
            return (
                <ol>
                    {files.map((value, index) => {
                        return <li key={index}><a target="_blank" href={value}>{value}</a></li>
                    })}
                </ol>
            );
        }
        return null
    }

    renderConfidenceScore(data) {
        if (data && Array.isArray(data)) {
            return (
                <ol>
                    {data.map((value, index) => {
                        return Object.keys(value).map((innerVal, innerIndex) => {
                            return <li key={index}>{innerVal} ==> {value[innerVal]}</li>
                        })
                    })}
                </ol>
            );
        }
        return null
    }

    renderMetaData(data) {
        if (data && Array.isArray(data)) {
            return (
                <ol>
                    {data.map((value, index) => {
                        return <li key={index}>{value['label'] || value['object']} ==> {value['score']}</li>
                    })}
                </ol>
            );
        }
        return null
    }

    renderDocumentCapturedData() {
        if (this.state.currentTab == 2) {
            return (
                <div className="tab submitFormFields">
                    {this.state.apiCapturedDocument.asset_type !== CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION &&
                        <div>
                            <strong>User Info:</strong>
                            <p>
                                Asset Type
                            <input readOnly placeholder="Asset Type" data-required="true" id="asset_type" value={this.state.apiCapturedDocument.asset_type} onChange={(event) => this.formChangeHandler('asset_type', event.target.value)} />
                            </p>
                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p>
                                    Customer id
                            <input readOnly placeholder="customer_id" data-required="true" id="customer_id" value={this.state.apiCapturedDocument.customer_id} onChange={(event) => this.formChangeHandler('customer_id', event.target.value)} />
                                </p>
                            }
                            {(this.state.documentType == CONSTANT.DOCUMENT_TYPE.PASSPORT || this.state.documentType == CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK) &&
                                (
                                    <p className="passport_number">
                                        Passport Number
                                    <input type="text" placeholder="passport number" id="passport_number" value={this.state.apiCapturedDocument.passport_number} onChange={(event) => this.formChangeHandler('passport_number', event.target.value)} />
                                    </p>
                                )
                            }
                            {(this.state.apiCapturedDocument.passport_number_front !== undefined) &&
                                (
                                    <p className="passport_number_front">
                                        Passport Number Front
                                    <input type="text" placeholder="passport number" id="passport_number_front" value={this.state.apiCapturedDocument.passport_number_front} onChange={(event) => this.formChangeHandler('passport_number_front', event.target.value)} />
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
                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD &&
                                (
                                    <p className="identity_number">
                                        Identity Number Front
                                    <input type="text" placeholder="identity number front" id="identity_number_front" value={this.state.apiCapturedDocument.identity_number_front} onChange={(event) => this.formChangeHandler('identity_number_front', event.target.value)} />
                                    </p>
                                )
                            }
                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD &&
                                (
                                    <p className="card_number">
                                        Card number
                                    <input type="text" placeholder="card number" id="card_number" value={this.state.apiCapturedDocument.card_number} onChange={(event) => this.formChangeHandler('card_number', event.target.value)} />
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
                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK &&
                                (
                                    <p className="visa_number">
                                        VISA Number
                                    <input type="text" placeholder="visa number" id="visa_number" value={this.state.apiCapturedDocument.visa_number} onChange={(event) => this.formChangeHandler('visa_number', event.target.value)} />
                                    </p>
                                )
                            }
                            {this.state.apiCapturedDocument.name_front !== undefined &&
                                (
                                    <p className="name_front">
                                        Front Name
                                    <input type="text" placeholder="front name" id="name_front" value={this.state.apiCapturedDocument.name_front} onChange={(event) => this.formChangeHandler('name_front', event.target.value)} />
                                    </p>
                                )
                            }
                            {this.state.documentType != CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p>
                                    First Name
                            <input placeholder="First Name" data-required="true" id="first_name" value={this.state.apiCapturedDocument.first_name} onChange={(event) => this.formChangeHandler('first_name', event.target.value)} />
                                </p>
                            }
                            {this.state.apiCapturedDocument.middle_name &&
                                <p>
                                    Middle Name
                                <input placeholder="First Name" data-required="true" id="middle_name" value={this.state.apiCapturedDocument.middle_name} onChange={(event) => this.formChangeHandler('middle_name', event.target.value)} />
                                </p>
                            }
                            {this.state.documentType != CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p>
                                    Last Name
                            <input placeholder="Last Name" data-required="true" id="last_name" value={this.state.apiCapturedDocument.last_name} onChange={(event) => this.formChangeHandler('last_name', event.target.value)} />
                                </p>
                            }
                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p>
                                    Name
                            <input placeholder="Name" data-required="true" id="name" value={this.state.apiCapturedDocument.name} onChange={(event) => this.formChangeHandler('name', event.target.value)} />
                                </p>
                            }
                            {this.state.apiCapturedDocument.gender &&
                                <p className="gender">
                                    Gender
                                <select name="gender" id="gender" value={this.state.apiCapturedDocument.gender} onChange={(event) => this.formChangeHandler('gender', event.target.value)}>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </p>
                            }
                            {this.state.apiCapturedDocument.address !== undefined &&
                                <p className="address">
                                    Address
                            <textarea placeholder="Address" id="address" value={this.state.apiCapturedDocument.address || ''} onChange={(event) => this.formChangeHandler('address', event.target.value)}></textarea>
                                </p>
                            }
                            {this.state.apiCapturedDocument.address_line1 &&
                                <p className="address">
                                    Address
                            <textarea placeholder="Address" id="address_line1" value={this.state.apiCapturedDocument.address_line1 || ''} onChange={(event) => this.formChangeHandler('address_line1', event.target.value)}></textarea>
                                </p>
                            }
                            {this.state.apiCapturedDocument.zip_code &&
                                <p className="zip_code">
                                    Zip Code
                            <textarea placeholder="zip code" id="zip_code" value={this.state.apiCapturedDocument.zip_code || ''} onChange={(event) => this.formChangeHandler('zip_code', event.target.value)}></textarea>
                                </p>
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
                            {(this.state.apiCapturedDocument.issue_date || this.state.documentType == CONSTANT.DOCUMENT_TYPE.DRIVING_LICENCE) &&
                                (
                                    <p className="issue_date">
                                        Issue Date
                                    <input placeholder="Issue Date" type="date" id="issue_date" value={this.state.apiCapturedDocument.issue_date || ''} onChange={(event) => this.formChangeHandler('issue_date', event.target.value)} />
                                    </p>
                                )
                            }
                            {this.state.documentType != CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p className="expiry_date">
                                    Expiry Date
                            <input placeholder="Expire Date" type="date" id="expiry_date" value={this.state.apiCapturedDocument.expiry_date || ''} onChange={(event) => this.formChangeHandler('expiry_date', event.target.value)} />
                                </p>
                            }
                            {this.state.apiCapturedDocument.state &&
                                <p className="state">
                                    State
                                <input placeholder="State" type="text" id="state" value={this.state.apiCapturedDocument.state} onChange={(event) => this.formChangeHandler('state', event.target.value)} />
                                </p>
                            }

                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p className="period_end_date">
                                    period_end_date
                                <input placeholder="period_end_date" type="date" id="period_end_date" value={this.state.apiCapturedDocument.period_end_date || ''} onChange={(event) => this.formChangeHandler('period_end_date', event.target.value)} />
                                </p>
                            }

                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.GASS_BILL &&
                                <p className="period_start_date">
                                    period start date
                                <input placeholder="period start date" type="date" id="period_start_date" value={this.state.apiCapturedDocument.period_start_date || ''} onChange={(event) => this.formChangeHandler('period_start_date', event.target.value)} />
                                </p>
                            }

                            {this.state.documentType == CONSTANT.DOCUMENT_TYPE.IDENTITY_CARD &&
                                (
                                    <p className="nationality_front">
                                        Nationality Front
                                <input type="text" placeholder="nationality front" id="nationality_front" value={this.state.apiCapturedDocument.nationality_front} onChange={(event) => this.formChangeHandler('nationality_front', event.target.value)} />
                                    </p>
                                )
                            }
                            {(this.state.documentType == CONSTANT.DOCUMENT_TYPE.IS_RIGHT_TO_WORK || this.state.apiCapturedDocument.nationality) &&
                                (
                                    <p>
                                        Nationality
                                    <input placeholder="Nationality" data-required="true" id="nationality" value={this.state.apiCapturedDocument.nationality} onChange={(event) => this.formChangeHandler('nationality', event.target.value)} />
                                    </p>
                                )
                            }
                            {this.state.apiCapturedDocument.nationality_code !== undefined &&
                                <p className="nationality_code">
                                    Nationality Code
                                <input placeholder="nationality_code" type="text" id="nationality_code" value={this.state.apiCapturedDocument.nationality_code} onChange={(event) => this.formChangeHandler('nationality_code', event.target.value)} />
                                </p>
                            }
                        </div>
                    }

                    {this.state.apiCapturedDocument.asset_type == CONSTANT.DOCUMENT_TYPE.VEHICLE_REGISTRATION &&
                        <div>
                            <pre>
                                <code>
                                    {JSON.stringify(this.state.apiCapturedDocument, null, 4)}
                                </code>
                            </pre>
                        </div>
                    }

                    {this.state.apiCapturedDocument.mrz_first &&
                        (
                            <p>
                                MRZ First
                                    <input readOnly placeholder="mrz_first" id="nationality" value={this.state.apiCapturedDocument.mrz_first} onChange={(event) => this.formChangeHandler('mrz_first', event.target.value)} />
                            </p>
                        )
                    }
                    {this.state.apiCapturedDocument.mrz_second &&
                        (
                            <p>
                                MRZ Second
                                    <input readOnly placeholder="mrz_second" id="nationality" value={this.state.apiCapturedDocument.mrz_second} onChange={(event) => this.formChangeHandler('mrz_second', event.target.value)} />
                            </p>
                        )
                    }
                    {this.state.apiCapturedDocument.mrz_third &&
                        (
                            <p>
                                MRZ Third
                                    <input readOnly placeholder="mrz_third" id="nationality" value={this.state.apiCapturedDocument.mrz_third} onChange={(event) => this.formChangeHandler('mrz_third', event.target.value)} />
                            </p>
                        )
                    }
                    {this.state.apiCapturedDocument.files &&
                        (
                            <div>
                                Files
                                    {this.renderFiles(this.state.apiCapturedDocument.files)}
                            </div>
                        )
                    }
                    {this.state.apiCapturedDocument.user_pic &&
                        (
                            <p>
                                user pic <br />
                                <a href={this.state.apiCapturedDocument.user_pic} target="_blank"><img src={this.state.apiCapturedDocument.user_pic} /></a>
                            </p>
                        )
                    }

                    {this.state.apiCapturedDocument.confidence_score !== undefined &&
                        <div className="confidence_score">
                            <b>Confidence Score</b>
                            {this.renderConfidenceScore(this.state.apiCapturedDocument.confidence_score)}
                        </div>
                    }

                    {this.state.apiCapturedDocument.meta_data !== undefined &&
                        <div className="confidence_score">
                            <b>Meta Data:</b>
                            {this.renderMetaData(this.state.apiCapturedDocument.meta_data)}
                        </div>
                    }

                    {this.state.image_quality_feedback &&
                        <div className="confidence_score">
                            <b>Image Quality Feedback:</b>
                            {this.state.image_quality_feedback}
                        </div>
                    }

                    {this.state.image_feedback &&
                        <div className="confidence_score">
                            <b>Image Feedback:</b>
                            <ol>
                                <li>front_image_orientation ==> {this.state.image_feedback.front_image_orientation}</li>
                                <li>front_image_resolution ==> {this.state.image_feedback.front_image_resolution}</li>
                                <li>is_front_exif_data ==> {this.state.image_feedback.is_front_exif_data ? 'true' : 'false'}</li>
                                {this.state.image_feedback.back_image_orientation &&
                                    <li>back_image_orientation ==> {this.state.image_feedback.back_image_orientation}</li>}
                                {this.state.image_feedback.back_image_resolution &&
                                    <li>back_image_resolution ==> {this.state.image_feedback.back_image_resolution}</li>}
                                {this.state.image_feedback.is_back_exif_data !== undefined &&
                                    <li>is_back_exif_data ==> {this.state.image_feedback.is_back_exif_data ? 'true' : 'false'}</li>}
                            </ol>
                        </div>
                    }

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
                {/* <div className="sidebar">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.logout}>
                                Logout
                    </a>
                        </li>
                    </ul>
                </div> */}
                <div className="sdk-container-1">
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

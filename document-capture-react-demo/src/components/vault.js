import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import DataFornixApi from 'data-fornix-api';
import DataFornixVault from 'data-fornix-web-vault';
import DataFornixDC from 'data-fornix-dc';
import { withCookies, Cookies } from 'react-cookie';
import Home from './home';
import Sidebar from './sidebar';
import Loader from './loader';
import { CONSTANT } from './../constants/index';

const style = `
    button.btn {
        background-color: #4CAF50;
    }
    .table-basic {
        background-color: #fff;
    }
`;

class Vault extends Component {
    apiServer = '';
    dataFornixWeb = '';

    constructor(props) {
        super(props);
        this.getUserAssetList = this.getUserAssetList.bind(this);
        this.getSharedAssetList = this.getSharedAssetList.bind(this);
        this.getOrganisationAssetRequestList = this.getOrganisationAssetRequestList.bind(this);
        this.getOrganisationAllAssetRequestList = this.getOrganisationAllAssetRequestList.bind(this);
        this.getUploadAssetRequestList = this.getUploadAssetRequestList.bind(this);
        this.vaultAction = this.vaultAction.bind(this);
        this.logout = this.logout.bind(this);
        this.renderDocumentCaptureSdk = this.renderDocumentCaptureSdk.bind(this);
        this.nextHandler = this.nextHandler.bind(this);
        this.updateTab = this.updateTab.bind(this);

        this.apiServer = new DataFornixApi(CONSTANT.API_TOKEN, function (res) {
            console.log(res);
        });
        let user_id;

        this.state = {
            activeAction: CONSTANT.VAULT_TYPE.ASSET_LIST,
            currentModule: 'User Asset List',
            showLoader: true,
            documentType: '',
            currentTab: 0,
            apiCapturedDocument: '',
            sdkCapturedDocument: ''
        };
    }

    componentDidMount() {
        const { cookies } = this.props;
        const loginData = cookies.get('login');
        const createUserRes = this.apiServer.createUser({
            "email": loginData.username,
            "name": loginData.name,
            "phone_number": loginData.phone_number,
            "country_code": loginData.country_code
        });
        createUserRes.then((success) => {
            console.log('User created successfully => ', success)
            this.getUserAssetList();
        }, function (error) {
            console.log('Error in create use => ', error);
        });
    }

    getUserAssetList() {
        this.setState({
            activeAction: CONSTANT.VAULT_TYPE.ASSET_LIST,
            currentModule: 'User Asset List',
            showLoader: true
        });
        const userAssets = this.apiServer.getAssets();
        userAssets.then((data) => {
            this.setState({
                showLoader: false
            });
            console.log('User assets successfully => ', data)
            // data-fornix vault
            const dataFornixVaultObj = new DataFornixVault({
                containerId: 'vaultElement',
                token: CONSTANT.SDK_TOKEN,
                type: CONSTANT.VAULT_TYPE.ASSET_LIST,
                data: data,
                styles: style,
                onComplete: this.vaultAction
            });
        }, function (error) {
            this.setState({
                showLoader: false
            });
            console.log('Error in create use => ', error);
        });
    }

    getSharedAssetList() {
        this.setState({
            activeAction: CONSTANT.VAULT_TYPE.SHARED_BY_ME,
            currentModule: 'My Shared Assets',
            showLoader: true
        });
        const userAssets = this.apiServer.getSharedAssets();
        userAssets.then((data) => {
            this.setState({
                showLoader: false
            });
            console.log('User assets successfully => ', data)
            // data-fornix vault
            const dataFornixVaultObj = new DataFornixVault({
                containerId: 'vaultElement',
                token: CONSTANT.SDK_TOKEN,
                type: CONSTANT.VAULT_TYPE.SHARED_BY_ME,
                data: data,
                styles: style,
                onComplete: this.vaultAction
            });
        }, (error) => {
            this.setState({
                showLoader: false
            });
            console.log('Error in create use => ', error);
        });
    }

    getOrganisationAssetRequestList() {
        this.setState({
            activeAction: CONSTANT.VAULT_TYPE.REQUEST_FOR_ASSET,
            currentModule: 'Organization Request for Assets',
            showLoader: true
        });
        const userAssets = this.apiServer.organisationAssetRequest();
        userAssets.then((data) => {
            this.setState({
                showLoader: false
            });
            console.log('User assets successfully => ', data)
            // data-fornix vault
            const dataFornixVaultObj = new DataFornixVault({
                containerId: 'vaultElement',
                token: CONSTANT.SDK_TOKEN,
                type: CONSTANT.VAULT_TYPE.REQUEST_FOR_ASSET,
                data: data,
                styles: style,
                onComplete: this.vaultAction
            });
        }, function (error) {
            this.setState({
                showLoader: false
            });
            console.log('Error in create use => ', error);
        });
    }

    getOrganisationAllAssetRequestList() {
        this.setState({
            activeAction: CONSTANT.VAULT_TYPE.REQUEST_FOR_ALL_ASSET,
            currentModule: 'Organization Request For All Assets',
            showLoader: true
        });
        const userAssets = this.apiServer.organisationAllAssetRequest();
        userAssets.then((data) => {
            this.setState({
                showLoader: false
            });
            console.log('Organization all assets => ', data)
            // data-fornix vault
            const dataFornixVaultObj = new DataFornixVault({
                containerId: 'vaultElement',
                token: CONSTANT.SDK_TOKEN,
                type: CONSTANT.VAULT_TYPE.REQUEST_FOR_ALL_ASSET,
                data: data,
                styles: style,
                onComplete: this.vaultAction
            });
        }, function (error) {
            this.setState({
                showLoader: false
            });
            console.log('Error in create use => ', error);
        });
    }

    getUploadAssetRequestList() {
        this.setState({
            activeAction: CONSTANT.VAULT_TYPE.UPLOAD_ASSET_REQUEST,
            currentModule: 'Organization Request for Upload Asset',
            showLoader: true
        });
        const userUploadAssetsRequestRes = this.apiServer.uploadAssetRequest();
        userUploadAssetsRequestRes.then((data) => {
            this.setState({
                showLoader: false
            });
            console.log('Organization all assets => ', data)
            // data-fornix vault
            const dataFornixVaultObj = new DataFornixVault({
                containerId: 'vaultElement',
                token: CONSTANT.SDK_TOKEN,
                type: CONSTANT.VAULT_TYPE.UPLOAD_ASSET_REQUEST,
                data: data,
                styles: style,
                onComplete: this.vaultAction
            });
        }, function (error) {
            this.setState({
                showLoader: false
            });
            console.log('Error in create use => ', error);
        });
    }

    vaultAction(type, data) {
        const self = this;
        if (type && data) {
            if (type.toLowerCase() === CONSTANT.VAULT_TYPE.ASSET_EDIT.toLowerCase()) {
                console.log('Api call for update data => ', data);
                this.setState({
                    showLoader: true
                });
                const updateAssetRes = this.apiServer.updateAssetDetails(data);
                updateAssetRes.then((success) => {
                    console.log('User created successfully => ', success);
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(success) || 'success');
                    this.getUserAssetList();
                }, (error) => {
                    console.log('Error in create use => ', error);
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(error) || 'error');
                    this.getUserAssetList();
                });
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.ASSET_DELETE.toLowerCase()) {
                let deleteMsg = 'Delete the item?'
                if (data && data.asset_type) {
                    deleteMsg = 'Are you sure want to delete ' + data.asset_type + '?';
                }
                if (window.confirm(deleteMsg)) {
                    console.log('data id for delete => ', data);
                    this.setState({
                        showLoader: true
                    });
                    const deleteAssetRes = this.apiServer.deleteAsset(data);
                    deleteAssetRes.then((success) => {
                        console.log('User created successfully => ', success)
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(success) || 'success');
                        this.getUserAssetList();
                    }, (error) => {
                        console.log('Error in create use => ', error);
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(error) || 'error');
                        this.getUserAssetList();
                    });
                }
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.ASSET_REVOKE.toLowerCase()) {
                console.log('revoe', type, data)
                let revokeMsg = 'Are you sure want to revoke?'
                if (data && data.asset_type) {
                    revokeMsg = 'Are you sure want to revoke ' + data.asset_type + '?';
                }
                if (window.confirm(revokeMsg)) {
                    console.log('revoke data => ', data);
                    this.setState({
                        showLoader: true
                    });
                    const revokeAssetRes = this.apiServer.revokeAsset(data);
                    revokeAssetRes.then((success) => {
                        console.log('asset revoked successfully => ', success)
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(success) || 'success');
                        this.getSharedAssetList();
                    }, (error) => {
                        console.log('Error in revoke asset => ', error);
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(error) || 'error');
                        this.getSharedAssetList();
                    });
                }
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.ASSET_UPDATE_TIME.toLowerCase()) {
                console.log('Api call for update access time => ', data);
                this.setState({
                    showLoader: true
                });
                const updateAssetAccessTimeRes = this.apiServer.updateAssetAccessTime(data);
                updateAssetAccessTimeRes.then((success) => {
                    console.log('Asset time updated successfully => ', success);
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(success) || 'success');
                    this.getSharedAssetList();
                }, (error) => {
                    console.log('Error in asset time update => ', error);
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(error) || 'error');
                    this.getSharedAssetList();
                });
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.REQUEST_FOR_ASSET_DENY.toLowerCase()) {
                console.log('Api call for asset request deny => ', data);
                let revokeMsg = 'Are you sure want to deny access?'
                if (data && data.asset_type) {
                    revokeMsg = 'Are you sure want to deny access of ' + data.asset_type + '?';
                }
                if (window.confirm(revokeMsg)) {
                    this.setState({
                        showLoader: true
                    });
                    const organizationRequestDenyRes = this.apiServer.organisationAssetRequestUpdate(data);
                    organizationRequestDenyRes.then((success) => {
                        console.log('Request deny => ', success)
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(success) || 'success');
                        this.getOrganisationAssetRequestList();
                    }, (error) => {
                        console.log('Error in request deny => ', error);
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(error) || 'error');
                        this.getOrganisationAssetRequestList();
                    });
                }
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.REQUEST_FOR_ASSET_ALLOW.toLowerCase()) {
                console.log('Api call for asset request allow => ', data);
                this.setState({
                    showLoader: true
                });
                const organizationRequestAllowRes = this.apiServer.organisationAssetRequestUpdate(data);
                organizationRequestAllowRes.then((success) => {
                    console.log('Request deny => ', success)
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(success) || 'success');
                    this.getOrganisationAssetRequestList();
                }, (error) => {
                    console.log('Error in request deny => ', error);
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(error) || 'error');
                    this.getOrganisationAssetRequestList();
                });
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.REQUEST_FOR_ALL_ASSET_DENY.toLowerCase()) {
                console.log('Api call for all asset request deny => ', data);
                let revokeMsg = 'Are you sure want to deny access?'
                if (data && data.shared_with_name) {
                    revokeMsg = 'Are you sure want to deny asset access for ' + data.shared_with_name + '?';
                }
                if (window.confirm(revokeMsg)) {
                    this.setState({
                        showLoader: true
                    });
                    const organizationRequestDenyRes = this.apiServer.organisationAllAssetRequestUpdate(data);
                    organizationRequestDenyRes.then((success) => {
                        console.log('Request deny => ', success)
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(success) || 'success');
                        this.getOrganisationAllAssetRequestList();
                    }, (error) => {
                        console.log('Error in request deny => ', error);
                        this.setState({
                            showLoader: false
                        });
                        alert(self.getResMessage(error) || 'error');
                        this.getOrganisationAllAssetRequestList();
                    });
                }
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.REQUEST_FOR_ALL_ASSET_ALLOW.toLowerCase()) {
                console.log('Api call for all asset request allow => ', data);
                this.setState({
                    showLoader: true
                });
                const organizationRequestAllowRes = this.apiServer.organisationAllAssetRequestUpdate(data);
                organizationRequestAllowRes.then((success) => {
                    console.log('Request deny => ', success)
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(success) || 'success');
                    this.getOrganisationAllAssetRequestList();
                }, (error) => {
                    console.log('Error in request deny => ', error);
                    this.setState({
                        showLoader: false
                    });
                    alert(self.getResMessage(error) || 'error');
                    this.getOrganisationAllAssetRequestList();
                });
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.UPLOAD_ASSET_REQUEST.toLowerCase()) {
                console.log('Api call for asset upload request => ', data);
                /* const organizationRequestAllowRes = this.apiServer.organisationAllAssetRequestUpdate(data);
                organizationRequestAllowRes.then((success) => {
                    console.log('Request deny => ', success)
                    alert(self.getResMessage(success) || 'success');
                }, (error) => {
                    console.log('Error in request deny => ', error);
                    alert(self.getResMessage(error) || 'error');
                }); */
                if (data && data.asset_type) {
                    this.setState({
                        documentType: data.asset_type,
                        currentTab: 1
                    }, () => {
                        this.renderDocumentCaptureSdk();
                    });
                } else {
                    alert('Invalid data provided for upload request');
                }
            } else if (type.toLowerCase() === CONSTANT.VAULT_TYPE.ASSET_ERROR) {
                alert(data || 'Error received by Vault SDK');
            } else {
                console.log('type', type);
                console.log('data', data);
            }
        }
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

    renderDocumentCapture() {
        if (this.state.currentTab == 1) {
            return (
                <div className="sdk-container">
                    <div className="tab">
                        <div id="documentCapture"></div>
                        <div style={{ overflow: 'auto' }}>
                            <div style={{ float: 'right' }}>
                                <button onClick={() => this.nextHandler(2)} type="button" id="nextBtn">Next</button>
                            </div>
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
                <div className="sdk-container">
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
                        {this.state.apiCapturedDocument.address &&
                            <p className="address">Address
                            <textarea placeholder="Address" id="address" value={this.state.apiCapturedDocument.address} onChange={(event) => this.formChangeHandler('address', event.target.value)}></textarea>
                            </p>
                        }
                        {this.state.apiCapturedDocument.birth_date &&
                            <p className="birth_date">
                                DOB
                            <input placeholder="DOB" type="date" id="birth_date" value={this.state.apiCapturedDocument.birth_date} onChange={(event) => this.formChangeHandler('birth_date', event.target.value)} />
                            </p>
                        }
                        {this.state.apiCapturedDocument.father_name &&
                            <p className="father_name">
                                Father Name
                            <input placeholder="father name" type="text" id="father_name" value={this.state.apiCapturedDocument.father_name} onChange={(event) => this.formChangeHandler('father_name', event.target.value)} />
                            </p>
                        }
                        {this.state.apiCapturedDocument.issue_date &&
                            <p className="issue_date">
                                Issue Date
                            <input placeholder="Expire Date" type="date" id="issue_date" value={this.state.apiCapturedDocument.issue_date} onChange={(event) => this.formChangeHandler('issue_date', event.target.value)} />
                            </p>
                        }
                        {this.state.apiCapturedDocument.expiry_date &&
                            <p className="expiry_date">
                                Expiry Date
                            <input placeholder="Expire Date" type="date" id="expiry_date" value={this.state.apiCapturedDocument.expiry_date} onChange={(event) => this.formChangeHandler('expiry_date', event.target.value)} />
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
                </div>
            );
        }
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
            }
        }
    }

    updateTab(tab) {
        if (tab == 0) {
            this.setState({
                currentTab: 0,
                documentType: '',
                apiCapturedDocument: '',
                sdkCapturedDocument: ''
            });
            this.getUploadAssetRequestList();
        } else {
            this.setState({
                currentTab: tab
            });
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

    logout() {
        this.props.logout();
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix Vault: {this.state.currentModule}</label>
                <div className="sidebar">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className={`${this.state.activeAction == CONSTANT.VAULT_TYPE.ASSET_LIST && 'active'} nav-link`} onClick={this.getUserAssetList} aria-current="page">
                                Asset Vault
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`${this.state.activeAction == CONSTANT.VAULT_TYPE.SHARED_BY_ME && 'active'} nav-link`} onClick={this.getSharedAssetList}>
                                Shared By Me
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`${this.state.activeAction == CONSTANT.VAULT_TYPE.REQUEST_FOR_ASSET && 'active'} nav-link`} onClick={this.getOrganisationAssetRequestList}>
                                Requet For Asset
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`${this.state.activeAction == CONSTANT.VAULT_TYPE.REQUEST_FOR_ALL_ASSET && 'active'} nav-link`} onClick={this.getOrganisationAllAssetRequestList}>
                                Request For All Asset
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`${this.state.activeAction == CONSTANT.VAULT_TYPE.UPLOAD_ASSET_REQUEST && 'active'} nav-link`} onClick={this.getUploadAssetRequestList}>
                                Upload Asset Request
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.logout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
                {!this.state.documentType && <div id="vaultElement"></div>}
                {this.renderDocumentCapture()}
                {this.renderDocumentCapturedData()}
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withCookies(Vault);

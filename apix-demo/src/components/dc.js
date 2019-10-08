import React, { Component } from 'react';
import DataFornixApi from 'data-fornix-web-api';
import DataFornixDC from 'data-fornix-web-dc';
import { withCookies, Cookies } from 'react-cookie';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

class Dc extends Component {
    apiServer = '';
    dataFornixWeb = '';

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            selfieImg: '',
            successRes:'',
            errorRes: ''
        };
        this.apiServer = new DataFornixApi({token: CONSTANT.API_TOKEN, baseUrl: CONSTANT.ENVIRONVEMENT_BASE_URL.apix}, function (res) {
            //console.log(res);
        });
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
            }, (error) => {
                console.log('Error in create use => ', error);
            });
        } else {
            alert('User not login');
        }

        this.dataFornixWeb = new DataFornixDC({
            containerId: 'documentCapture',
            token: CONSTANT.SDK_TOKEN,
            onComplete: (res) => {
                if (res.frontFile) {
                    this.setState({
                        selfieImg: res.frontFile
                    });
                } else {
                    alert('error in selfie upload');
                }
            }
        });
    }

    submitSelfie = () => {
        if (this.state.selfieImg) {
            this.setState({
                showLoader: true
            });
            const selfieCheckRes = this.apiServer.selfieVerify({
                profile_pic: this.state.selfieImg
            });
            selfieCheckRes.then((success) => {
                console.log('successfully => ', success);
                this.setState({
                    showLoader: false,
                    selfieImg: '',
                    successRes: success['message'] || success
                });
            }, (error) => {
                console.log('Error => ', error);
                this.setState({
                    showLoader: false,
                    selfieImg: '',
                    errorRes: error['message'] || error
                });
            });
        } else {
            alert('Please upload selfie image');
        }
    }

    renderSuccessRes(data) {
        if (data) {
            return data.map(key => <ol key={key}>
                <li>For document type <b>{key.asset_type}</b> => </li>
                <li>Is Matched: {key.is_matched.toString()}</li>
                <li>User Pic: <a href={key.user_pic} target="_blank">{key.user_pic}</a></li>
                <li>Selfie Pic: <a href={key.selfie_pic} target="_blank">{key.selfie_pic}</a></li>
            </ol>
            )
        }
        return null;
    }

    render() {
        return (
            <div>
                <label className="page-title">Data Fornix: Selfie Upload</label>
                <div className="sdk-container-1">
                    {<div id="documentCapture"></div>}
                    {this.state.successRes && (
                        <ul>
                            <li>Overall result => {this.state.successRes.overall_result.toString()}</li>
                            <li>
                                {this.state.successRes.comparison_result.length
                                    && this.renderSuccessRes(this.state.successRes.comparison_result)}
                            </li>
                        </ul>
                    )}
                    {this.state.errorRes && <pre>{JSON.stringify(this.state.errorRes)}</pre>}
                    <div>
                        <div style={{ overflow: 'auto' }}>
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={() => this.submitSelfie()} type="button">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default withCookies(Dc);

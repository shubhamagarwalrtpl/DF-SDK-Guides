import React, { Component } from 'react';
import DataFornixApi from 'data-fornix-web-api';
import DataFornixDC from 'data-fornix-dc';
import { withCookies, Cookies } from 'react-cookie';
import { CONSTANT } from './../constants/index';
import Loader from './loader';

class ScreenCapture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentModule: 'Screen Capture',
            showLoader: false
        };
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
                <div id="container" className="sdk-container">
                    <iframe width="700" height="5000" id="gmap_canvas"
                        src="http://asthmaairways.blogspot.com/2010/08/more-british-passports-used-in-mahmoud.html" frameborder="0"
                        marginheight="0" marginwidth="0"></iframe>
                </div>
                {this.state.showLoader && <Loader />}
            </div>
        );
    }
}

export default ScreenCapture;

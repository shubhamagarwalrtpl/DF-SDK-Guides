
import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import Home from './home';
import Vault from './vault';

class Sidebar extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="sidebar">
                <ul className="nav">
                    <li className="nav-item">
                        <a className="nav-link active" href="#/dashboard" aria-current="page">
                            <i className="nav-icon icon-speedometer"></i>
                            Dashboard
                        <span className="badge badge-info">NEW</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#/theme/colors">
                            <i className="nav-icon icon-drop"></i>
                            Colors
                    </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#/theme/typography">
                            <i className="nav-icon icon-pencil"></i>
                            Typography
                    </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;

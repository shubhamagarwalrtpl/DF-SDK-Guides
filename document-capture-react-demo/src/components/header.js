import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    NavLink
} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import Home from './home';
import Vault from './vault';

class Header extends Component {
    constructor(props) {
        super(props);

        const { cookies } = props;
        let loginData = cookies.get('login');

        this.state = {
            login: loginData
        };

        this.logoutHandler = this.logoutHandler.bind(this);
    }

    logoutHandler() {
        this.props.logout();
    }

    render() {
        return (
            <Router>
                <div className="header-main">
                    <ul className="header-nav">
                        <li>
                            <NavLink to="/" exact>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/vault" exact>Vault</NavLink>
                        </li>
                    </ul>
                    <Route exact path="/" render={() => <Home logout={this.logoutHandler} />} />
                    <Route exact path="/vault" render={() => <Vault logout={this.logoutHandler} />} />
                    {this.state.login &&
                        <div className="login-detail">
                            Welcome {this.state.login.name}
                        </div>
                    }
                </div>
            </Router>
        );
    }
}

export default withCookies(Header);
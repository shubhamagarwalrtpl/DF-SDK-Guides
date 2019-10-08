import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: ''
        };
        this.loginSubmitHandler = this.loginSubmitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    loginSubmitHandler() {
        if (this.state.email && this.state.password) {
            this.props.login({
                email: this.state.email,
                password: this.state.password
            });
        } else {
            alert('Invalid data provided');
        }
    }

    changeHandler(value, key) {
        this.setState({
            [key]: value
        });
    };

    render() {
        return (
            <div>
                <form id="regForm">
                    <h1 id="heading">Login</h1>
                    <div className="tab">
                        <p>
                            <label>Email:</label>
                            <input data-required="true" placeholder="Email" id="email" type="email" name="fname"
                                required onChange={(event) => this.changeHandler(event.target.value, 'email')} value={this.state.email} />
                        </p>
                        <p>
                            <label>Password:</label>
                            <input data-required="true" placeholder="Password" id="password" type="password" name="lname"
                                required onChange={(event) => this.changeHandler(event.target.value, 'password')} value={this.state.password} />
                        </p>
                    </div>
                    <div style={{ overflow: 'auto' }}>
                        <div style={{ float: 'right' }}>
                            <button onClick={this.loginSubmitHandler} type="button" id="nextBtn">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Login.propTypes = {
    login: PropTypes.func
};

export default Login;

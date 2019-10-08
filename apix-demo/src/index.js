import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';
import Header from './components/header';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <CookiesProvider>
        <HashRouter>
            <App />
        </HashRouter>
    </CookiesProvider>,
    document.getElementById('menus')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

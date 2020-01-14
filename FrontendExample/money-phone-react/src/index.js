import React from 'react';
import ReactDOM from 'react-dom';
import 'goratchet/dist/css/ratchet.min.css';
import './MoneyPhone.css';
import MoneyPhone from './MoneyPhone';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<MoneyPhone />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

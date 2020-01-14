import React from 'react';
import 'jquery/dist/jquery.min.js';
import 'goratchet/dist/css/ratchet.min.css';
/* import './link-initialize.js'; */
import PlaidLink from 'react-plaid-link'
import './MoneyPhone.css';
import './MoneyIcons.css';
import History from './History';
import Categories from './Categories';
import Merchants from './Merchants';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class LinkBankAccount extends React.Component {
  handleOnSuccess(token, metadata) {
    // send token to client server
    console.log("handleOnSuccess [plaid]");
  }
  handleOnExit() {
    // handle the case when your user exits Link
    console.log("handleOnExit [plaid]");
  }
  render() {
    return (
      <PlaidLink
        clientName="MoneyPhone"
        env="sandbox"
        product={["transactions"]}
        publicKey="ec100aa563032883bfe909c9173648"
        onExit={this.handleOnExit}
        onSuccess={this.handleOnSuccess}>
        Open Link and connect your bank!
      </PlaidLink>
    )
  }
}
export default LinkBankAccount
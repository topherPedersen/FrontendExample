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
import Modal from './Modal';
/* import LinkBankAccount from './LinkBankAccount'; */
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MoneyPhoneConfig from './MoneyPhoneConfig.js';

class CashFlow extends React.Component {

  /*
  handleLinkAccountButtonClick(e) {
    console.log("handling Link Account Button Click!!!");
  }
  */

// this.props.presentLoadingModal, this.props.closeLoadingModal
  handleOnSuccess(token, metadata, oldState, refreshData, email, password, presentLoadingModal, closeLoadingModal) {

    var presentLoadingModalWhileRefreshingData = () => presentLoadingModal();
    var closeLoadingModalOnError = () => closeLoadingModal();

    // Present loading modal before making initial AJAX Request,
    // and before fetching updated financial data
    presentLoadingModalWhileRefreshingData();

    // Submit Email, Password, Token, and Metadata to Server
    // The server will then use this information to retrieve
    // an access token from Plaid's servers.
    var httpRequest = new XMLHttpRequest();
    var httpRequestURL = MoneyPhoneConfig.domain + "/get_access_token";
    httpRequest.open("POST", httpRequestURL, true);
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        // Get Response Data
        var responseData = this.responseText;
        console.log("/get_access_token responseData: " + responseData); // data in this case should be a simple string, and not JSON

        if (responseData === "token_received") {
          // TODO: write code here to fetch updated financial data from MoneyPhone Servers...
          console.log("fetching fresh financial data...");
          refreshData(email, password, oldState);
        } else {
          closeLoadingModalOnError();
        }

      } else if (this.readyState == 4 && this.status != 200) {
        closeLoadingModalOnError();
      }
    };
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("public_token", token);
    formData.append("institution_name", metadata.institution.name);
    httpRequest.send(formData);  
    
  }

  handleOnExit(email, password) {
    // handle the case when your user exits Link
    console.log("handleOnExit [plaid]");
    console.log("email: " + email);
    console.log("password: " + password);
    // alert(MoneyPhoneConfig.domain);
  }


  render() {
    var activeIcon = {
      color: "#23e000"
    }

    var inactiveIcon = {
      color: "#656464"
    }

    if (localStorage.email != "skip@moolabeast.com") {
      return(
        <div>

          <Modal shouldDisplayLoadingModal={ this.props.shouldDisplayLoadingModal } />

          <div className="main-div">

            <header className="navbar bar bar-nav">
              <h1 className="navbar-title title">Moolabeast</h1>
            </header>
            
            <div className="main-content-div content">
              <div className="cashflow-div-container-wrapper">
                <div className="cashflow-div-container vertical-center">
                  <center><h1 className="cashflow-h1 grey thin-font">Statement of Cash Flows</h1></center>
                  <center><p className="cashflow-subheading">Current Month</p></center>
                  <center>
                      <div className="cashflow-div">
                        <table style={ { width: "88%" } }>
                          <tr className="income thin-font">
                            <td>Income:</td> 
                            <td style={ {textAlign: "right" } }>$<span className="income-span">{this.props.data.incomeStr}</span></td>
                          </tr>
                          <tr className="expenses thin-font">
                            <td>Expenses:</td>
                            <td style={ {textAlign: "right"} }>$<span className="expenses-span">{this.props.data.expensesStr}</span></td>
                          </tr>
                        </table>
                        <hr className="bottom-line-upper-hr"/>
                        <center><p className="bottom-line-text">The Bottom Line</p></center>
                        <hr className="bottom-line-lower-hr"/>
                        <table style={ {width: "88%"} }>
                          <tr className="cashflow thin-font">
                            <td>Cash Flow:</td> 
                            <td style={{ textAlign: "right" }}><span className="positive-negative-span">{this.props.data.cashflowSign}</span> $<span className="cashflow-span">{this.props.data.cashflowStr}</span></td>
                          </tr>
                        </table>
                      </div>
                  </center>
                  <br/>
                  <center>
                    <PlaidLink
                      style={{ borderStyle: "hidden", backgroundColor: "transparent" }}
                      clientName="MoneyPhone"
                      env="sandbox"
                      product={["transactions"]}
                      publicKey="ec100aa563032883bfe909c9173648"
                      onExit={ () => this.handleOnExit(this.props.data.email, this.props.data.password) }
                      onSuccess={ (token, metadata) => this.handleOnSuccess(token, metadata, this.props.oldState, this.props.refreshData, this.props.data.email, this.props.data.password, this.props.presentLoadingModal, this.props.closeLoadingModal) }>
                        <button className="link-account-btn">Link Bank Account or Credit Card</button>
                    </PlaidLink>
                  </center>
                </div>
              </div>
            </div>
            
            <nav className="bar bar-tab">
              
              <div className="tab-item">              
                <Link to="/CashFlow" style={ activeIcon }>
                  <span className="icon flaticon-credit-card-5 icon-mod"></span>
                  <span className="tab-label light-font">Cash Flow</span>
                </Link>
              </div>

              <div className="tab-item">
                <Link to="/History" style={ inactiveIcon }>
                  <span className="icon flaticon-graph-5 icon-mod"></span>
                  <span className="tab-label light-font">History</span>
                </Link>
              </div>

              <div className="tab-item">
                <Link to="/Categories" style={ inactiveIcon }>
                  <span className="icon flaticon-pie-chart icon-mod"></span>
                  <span className="tab-label light-font">Categories</span>
                </Link>
              </div>

              <div className="tab-item">
                <Link to="/Merchants" style={ inactiveIcon }>
                  <span className="icon flaticon-open icon-mod"></span>
                  <span className="tab-label light-font">Merchants</span>
                </Link>
              </div>

            </nav>

          </div>
        </div>
      );
    // ELSE, display special Cashflow page for guest user with PlaidLink Disabled!
    } else {
      return(
        <div>

          <Modal shouldDisplayLoadingModal={ this.props.shouldDisplayLoadingModal } />

          <div className="main-div">

            <header className="navbar bar bar-nav">
              <h1 className="navbar-title title">Moolabeast</h1>
            </header>
            
            <div className="main-content-div content">
              <div className="cashflow-div-container-wrapper">
                <div className="cashflow-div-container vertical-center">
                  <center><h1 className="cashflow-h1 grey thin-font">Statement of Cash Flows</h1></center>
                  <center><p className="cashflow-subheading">Current Month</p></center>
                  <center>
                      <div className="cashflow-div">
                        <table style={ { width: "88%" } }>
                          <tr className="income thin-font">
                            <td>Income:</td> 
                            <td style={ {textAlign: "right" } }>$<span className="income-span">{this.props.data.incomeStr}</span></td>
                          </tr>
                          <tr className="expenses thin-font">
                            <td>Expenses:</td>
                            <td style={ {textAlign: "right"} }>$<span className="expenses-span">{this.props.data.expensesStr}</span></td>
                          </tr>
                        </table>
                        <hr className="bottom-line-upper-hr"/>
                        <center><p className="bottom-line-text">The Bottom Line</p></center>
                        <hr className="bottom-line-lower-hr"/>
                        <table style={ {width: "88%"} }>
                          <tr className="cashflow thin-font">
                            <td>Cash Flow:</td> 
                            <td style={{ textAlign: "right" }}><span className="positive-negative-span">{this.props.data.cashflowSign}</span> $<span className="cashflow-span">{this.props.data.cashflowStr}</span></td>
                          </tr>
                        </table>
                      </div>
                  </center>
                  <br/>
                  <center>
                    <button 
                      className="link-account-btn"
                      onClick={ () => this.props.promptGuestToLogout() }>
                      Link Bank Account or Credit Card
                    </button>
                  </center>
                </div>
              </div>
            </div>
            
            <nav className="bar bar-tab">
              
              <div className="tab-item">              
                <Link to="/CashFlow" style={ activeIcon }>
                  <span className="icon flaticon-credit-card-5 icon-mod"></span>
                  <span className="tab-label light-font">Cash Flow</span>
                </Link>
              </div>

              <div className="tab-item">
                <Link to="/History" style={ inactiveIcon }>
                  <span className="icon flaticon-graph-5 icon-mod"></span>
                  <span className="tab-label light-font">History</span>
                </Link>
              </div>

              <div className="tab-item">
                <Link to="/Categories" style={ inactiveIcon }>
                  <span className="icon flaticon-pie-chart icon-mod"></span>
                  <span className="tab-label light-font">Categories</span>
                </Link>
              </div>

              <div className="tab-item">
                <Link to="/Merchants" style={ inactiveIcon }>
                  <span className="icon flaticon-open icon-mod"></span>
                  <span className="tab-label light-font">Merchants</span>
                </Link>
              </div>

            </nav>

          </div>
        </div>
      );
    }
  }
}

export default CashFlow;
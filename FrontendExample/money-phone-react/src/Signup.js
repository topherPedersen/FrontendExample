import React from 'react';
import 'goratchet/dist/css/ratchet.min.css';
import './MoneyPhone.css';
import CashFlow from './CashFlow';
import History from './History';
import Categories from './Categories';
import Merchants from './Merchants';
import Login from './Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MoneyPhoneConfig from './MoneyPhoneConfig.js';

class Signup extends React.Component {

  constructor(props) {
    super(props);

    // Set State
    this.state = {
      signupEmail: "",
      signupPassword: "",
      signupPhoneNumber: ""
    };

    // bind this to form input event listeners
    this.handleSignupEmailInputChange = this.handleSignupEmailInputChange.bind(this);
    this.handleSignupPasswordInputChange = this.handleSignupPasswordInputChange.bind(this);
    this.handleSignupPhoneNumberInputChange = this.handleSignupPhoneNumberInputChange.bind(this);
  }

  handleSignupEmailInputChange(event) {
    var oldState = this.state;
    var newState = oldState;
    newState.signupEmail = event.target.value;
    this.setState(newState);
  }

  handleSignupPhoneNumberInputChange(event) {
    var oldState = this.state;
    var newState = oldState;
    newState.signupPhoneNumber = event.target.value;
    this.setState(newState);
  }

  handleSignupPasswordInputChange(event) {
    var oldState = this.state;
    var newState = oldState;
    newState.signupPassword = event.target.value;
    this.setState(newState);
  }

  handleSignup(e, presentLoadingModal, closeLoadingModal, loginOnSignup, oldState) {

    // var launchLoadingModalOnSignUp = () => presentLoadingModal();

    // presentLoadingModal();
    var showLoadingModal = () => presentLoadingModal();
    var closeLoadingModalOnFailure = () => closeLoadingModal();
    var loginOnSignupSuccess = (email, password, oldStateParam) => loginOnSignup(email, password, oldStateParam);

    var previousState = oldState;
 
    e.preventDefault(); // prevent default html form submission

    var signupEmail = this.state.signupEmail;
    signupEmail = signupEmail.toLowerCase();
    var signupPassword = this.state.signupPassword;
    var signupPhoneNumber = this.state.signupPhoneNumber;

    // save signup email & password to localStorage
    localStorage.email = signupEmail;
    localStorage.password = signupPassword;

    // debug/test info
    var signupTestingMessage = "Email entered: " + signupEmail + "\n";
    signupTestingMessage += "Phone Number entered: " + signupPhoneNumber + "\n";
    signupTestingMessage += "Password entered: " + signupPassword;
    console.log(signupTestingMessage);

    var formData = new FormData();
    formData.append('email', signupEmail); 
    formData.append('password', signupPassword);
    formData.append('phonenumber', signupPhoneNumber);
    var url = MoneyPhoneConfig.domain + "/signup";

    showLoadingModal();

    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {

        if (http.responseText == "signup_successful") {
          // closeLoadingModalOnFailure(); // REMOVE IN PRODUCTION, TEMPORARILY ADDED DURING TESTING
          loginOnSignupSuccess(signupEmail, signupPassword, previousState);
        } else {
          closeLoadingModalOnFailure();
          console.log("SIGNUP ERROR: (http.responseText)" + http.responseText);
          console.log("SIGNUP ERROR: (http.status)" + http.status.toString());
          alert("ERROR: Signup Failed. If you already have a registered an account with this email address, please use the login page.");
        }            

      } else if (http.readyState == 4 && http.status != 200) {
        closeLoadingModalOnFailure();
        console.log("SIGNUP ERROR: (http.responseText)" + http.responseText);
        console.log("SIGNUP ERROR: (http.status)" + http.status.toString());
        alert("ERROR: Signup Failed. If you already have a registered an account with this email address, please use the login page.");

      }
    }
    http.send(formData);
  }

  handleSkipSignup(e, presentLoadingModal, closeLoadingModal, loginOnSignup, oldState) {

    // The code below was taken directly from the handleSignup() function.
    // However, we have essentially removed the signup feature and gone straight
    // ahead to logging in with a set of dummy credentials. This was a hacked-together
    // workaround for quickly implementing a "skip signup" feature to allow new
    // users who have just downloaded the app a way to log into the app without 
    // actually signing up for the app. So we simply call the loginOnSignupSuccess
    // function with a set of re-usable guest credentials: skip@moolabeast.com 972-555-0101

    var showLoadingModal = () => presentLoadingModal();
    
    //var loginOnSignupSuccess = (email, password, oldStateParam) => loginOnSignup(email, password, oldStateParam);

    // save signup email & password to localStorage
    localStorage.email = "skip@moolabeast.com";
    localStorage.password = "guest";

    var previousState = oldState;
 
    // e.preventDefault(); // prevent default html form submission

    showLoadingModal();

    loginOnSignup("skip@moolabeast.com", "guest", previousState);
  }

  handlePingServer() {
    var formData = new FormData();
    var pingServerEndPointURL = MoneyPhoneConfig.domain + "/ping-server";
    var http = new XMLHttpRequest();
    http.open('POST', pingServerEndPointURL, true);
    http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);         
      } else if (http.readyState == 4 && http.status != 200) {
        alert("Server Ping Failed");
      }
    }
    http.send(formData);
  }

  render() {
    return(
      <div>

        <div className="main-div">

          <header className="navbar bar bar-nav">
            <h1 className="navbar-title title">Moolabeast</h1>
          </header>
          
          <div className="main-content-div content">
            <div className="login-div-container-wrapper">
              <div className="login-div-container vertical-center">

                <br/>

                <center>
                  <div className="login-form">
                    <form 
                      onSubmit={ (event) => this.handleSignup(event, this.props.presentLoadingModal, this.props.closeLoadingModal, this.props.loginOnSignup, this.props.oldState) } >
                      <input 
                        className="email-input" 
                        type="text" 
                        placeholder="Email"
                        onChange={this.handleSignupEmailInputChange} />
                      <br/>
                      <input 
                        className="phonenumber-input" 
                        type="text" 
                        placeholder="Phone Number"
                        onChange={this.handleSignupPhoneNumberInputChange} />
                      <input 
                        className="password-input" 
                        type="password" 
                        placeholder="Password"
                        onChange={this.handleSignupPasswordInputChange} />
                      <br/>
                      <button className="login-btn">Sign Up</button>
                    </form>
                    <button className="skip-btn" onClick={ (event) => this.handleSkipSignup(event, this.props.presentLoadingModal, this.props.closeLoadingModal, this.props.loginOnSignup, this.props.oldState) }>Skip</button>

                    <br/>

                    <p>Already have an account? <Link to="/Login"><span style={ {color: "blue", textDecoration: "underline"} }>Log In</span></Link></p>

                  </div>
                
                </center>



              </div>
            </div>

          </div>
          
          <nav className="bar bar-tab">
          </nav>

        </div>

      </div>
    );
  }
}

export default Signup;
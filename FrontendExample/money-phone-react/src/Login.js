import React from 'react';
import 'goratchet/dist/css/ratchet.min.css';
import './MoneyPhone.css';
import CashFlow from './CashFlow';
import History from './History';
import Categories from './Categories';
import Merchants from './Merchants';
import Signup from './Signup';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MoneyPhoneConfig from './MoneyPhoneConfig.js';

class Login extends React.Component {

  constructor(props) {
    super(props);

    // If the user has previously logged in with the "skip signup"
    // feature, clear the dummy login credentials
    if (localStorage.email == "skip@moolabeast.com") {
      localStorage.clear();
    }

    // Retrieve Saved Email from localStorage
    var savedEmail;
    if (localStorage.email !== undefined || localStorage.email === "") {
      savedEmail = localStorage.email;
    } else {
      savedEmail = "";
    }

    // Retrieve Saved Password from localStorage
    var savedPassword;
    if (localStorage.password !== undefined || localStorage.password === "") {
      savedPassword = localStorage.password;
    } else {
      savedPassword = "";
    }

    // Set State
    this.state = {
      email: savedEmail,
      password: savedPassword
    };
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
  }

  submitLoginCredentials(event, updateLoginState, emailInput, passwordInput, presentLoadingModal, closeLoadingModal) {
    
    event.preventDefault();

    presentLoadingModal(); // show loading modal  while user is logging in

    var closeLoadingModalOnLoginSuccess = () => closeLoadingModal();
    var closeLoadingModalOnLoginFailure = () => closeLoadingModal();

    // Save Login Credentials in localStorage
    localStorage.email = emailInput;
    localStorage.password = passwordInput;

    console.log("submitLoginCredentials() called");
    var httpRequest = new XMLHttpRequest();
    var httpRequestURL = MoneyPhoneConfig.domain + "/login";
    httpRequest.open("POST", httpRequestURL, true);
    httpRequest.onreadystatechange = function(login) {
      if (this.readyState == 4 && this.status == 200) {
        // Get Response Data
        var data = this.responseText;
        data = JSON.parse(data); // REFERENCE: data.email, data.password, data.xyz returned from server
        // Log status
        console.log("server response...");
        console.log("email returned from server: " + data.email);
        console.log("password returned from server: " + data.password);
        console.log("authenticated equals: " + data.authenticated);
        // if the user has been authenticated set this variable equal to true
        var loginSuccessful = data.authenticated; 
        // Log in! (or display error message)
        if (data.authenticated === true) {
          closeLoadingModalOnLoginSuccess();
          updateLoginState(emailInput, passwordInput, data);
        } else {
          alert("The password you've entered is incorrect. Forgot password?");
          closeLoadingModalOnLoginFailure();
        }
      } else if (this.readyState == 4 && this.status != 200) {
        closeLoadingModalOnLoginFailure();
        alert("Whoops! Something is technically wrong. Thanks for noticing-- we're going to fix it up and have things back to to normal soon.");
      }
    };
    var formData = new FormData();
    formData.append("email", emailInput);
    formData.append("password", passwordInput);
    httpRequest.send(formData);     
  }

  handleEmailInputChange(event) {
    var oldState = this.state;
    var newState = oldState;
    newState.email = event.target.value;
    localStorage.email = newState.email;
    this.setState(newState);
  }

  handlePasswordInputChange(event) {
    var oldState = this.state;
    var newState = oldState;
    newState.password = event.target.value;
    localStorage.password = newState.password;
    this.setState(newState);
  }

  handlePasswordResetRequest() {
    var email = prompt("To submit a password reset request, please enter the email address associated with your account and press 'OK'. Press 'CANCEL' to cancel.");
    if (email != null) {
      var httpRequest = new XMLHttpRequest();
      var httpRequestURL = MoneyPhoneConfig.domain + "/receive-password-reset-request";
      httpRequest.open("POST", httpRequestURL, true);
      httpRequest.onreadystatechange = function(login) {
        if (this.readyState == 4 && this.status == 200) {
          // Get Response Data
          var data = this.responseText;
          if (data === "success") {
            alert("Sorry about the trouble getting logged in! We've received your password reset request, and have sent a link to your email where you can create a new password. If you have any trouble finding the email, please check your spam folder.");
          } else {
            alert("ERROR: Please contact customer support => chris@topherpedersen.com");
          }
        } else if (this.readyState == 4 && this.status != 200) {
          alert("ERROR: Please contact customer support => chris@topherpedersen.com");
        }
      };
      var formData = new FormData();
      formData.append("email", email);
      httpRequest.send(formData); 
    }
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

                <br/><br/><br/>

                <center>
                  <form 
                    className="login-form" 
                    onSubmit={ (event) => this.submitLoginCredentials(event, this.props.updateLoginState, this.state.email, this.state.password, this.props.presentLoadingModal, this.props.closeLoadingModal) }>
                    <input 
                      className="email-input" 
                      type="text" 
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleEmailInputChange}/>
                    <br/>
                    <input 
                      className="password-input" 
                      type="password" 
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handlePasswordInputChange}/>
                    <br/>
                    <button className="login-btn">Log In</button>
                    <br/>
                  </form>
                </center>

                <center>
                  <p>New to Moolabeast? <Link to="/Signup"><span style={ {color: "blue", textDecoration: "underline"} }>Sign Up</span></Link></p>
                  <p>Forgot Password? <span onClick={ () => this.handlePasswordResetRequest() } style={ {color: "blue", textDecoration: "underline"} }>Reset Password</span></p>
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

export default Login;
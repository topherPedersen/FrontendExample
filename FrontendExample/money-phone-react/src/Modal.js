import React from 'react';
import 'goratchet/dist/css/ratchet.min.css';
import './MoneyPhone.css';
import loadingGif from './assets/loading.gif';
import yeet1 from './assets/heart.gif';
import yeet2 from './assets/bitmoji.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// REFERENCE (Modals from Scratch in ReactJS)
// https://alligator.io/react/modal-component/
class Modal extends React.Component {

  render() {

    var email = localStorage.email;

    var modalStyleOpen = {
      display: "block",
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000
    }

    var modalStyleClosed = {
      display: "none",
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000
    }

    var modalContentStyling = {
      position: "fixed",
      background: "white",
      width: "90%",
      height: "175px",
      top: "50%",
      left: "50%",
      textAlign: "center",
      transform: "translate(-50%, -50%)"
    }

    var loadingGifStyling = {
      marginTop: "55px",
    }

    var heartStyling = {
      marginTop: "40px",
      width: "96px",
      height: "96px"
    }

    // Set Sytling for Modal Based on Open/Close State
    var modalStyling;
    if (this.props.shouldDisplayLoadingModal) {
      modalStyling = modalStyleOpen;
    } else {
      modalStyling = modalStyleClosed;
    }

    // If user Christine N. logs in, present her with a special modal
    if (this.props.email === 'christine.nicodem@gmail.com') {
      return(
        <div style={ modalStyling }>
          <div style={ modalContentStyling }>
            <img src={ yeet1 } style={ heartStyling } />
            <img src={ yeet2 } style={ { position: "fixed", width: 96, height: 96, bottom: "0px", left: "12px" } } />
          </div>
        </div>
      );
    } else {
      // Give everyone else the regular modal
      return(
        <div style={ modalStyling }>
          <div style={ modalContentStyling }>
            <img src={ loadingGif } style={ loadingGifStyling } />
          </div>
        </div>
      );
    }

  }
}

export default Modal;
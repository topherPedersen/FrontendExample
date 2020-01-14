import React from 'react';
import 'goratchet/dist/css/ratchet.min.css';
import './MoneyPhone.css';
import './MoneyIcons.css';
import './Tables.css';
import CashFlow from './CashFlow';
import History from './History';
import Categories from './Categories';
import Modal from './Modal';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Merchants extends React.Component {
  render() {

    var activeIcon = {
      color: "#23e000"
    }

    var inactiveIcon = {
      color: "#656464"
    }

    var tableRows = []; // array which will how table rows of merchant transaction histories
    
    var merchant;
    if (this.props.data.currentMerchant === 0) {
      merchant = this.props.data.all.merchant_0;
    } else if (this.props.data.currentMerchant === 1) {
      merchant = this.props.data.all.merchant_1;
    } else if (this.props.data.currentMerchant === 2) {
      merchant = this.props.data.all.merchant_2;
    }

    console.log("merchant length: " + merchant.length);
    //console.log("merchant : " + merchant.length);

    for (var i = 0; i < merchant.length; i++) {

      // If transaction amount is negative (-), skip
      // Note: negative transaction amount represent income, not expense
      if (merchant[i].amount_spent <= 0) { continue }

      const amountSpentFormatted = merchant[i].amount_spent.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

      tableRows.push(
        <tr>
          <td className="align-left">{ merchant[i].name }</td>
          <td className="align-left">{ merchant[i].number_of_transactions }</td>
          <td className="align-left">${ amountSpentFormatted }</td>
        </tr>
      );  
    }

    // Bug Fix: The correct dropdown is not remaining "selected" when transitioning between screens.
    // dynamically set "selected" for the <select/> component by looking at state. Notes, this was not 
    // needed for Categories.js. Maybe this is because everytime we re-render the financial data
    // contained in our table the select loses focus, whereas the select does not lose focus
    // on the Categories.js screen because React isn't re-rendering things?
    var currentMerchant = this.props.data.currentMerchant;
    var select;
    if (currentMerchant === 0) {
      select = <select className="merchant-select show-dropdown-arrow" onChange={ (e) => this.props.selectMerchant(e) }>
                 <option value="0" selected>Current Month</option>
                 <option value="1">1 Month Ago</option>
                 <option value="2">2 Months Ago</option>
               </select>;
    } else if (currentMerchant === 1) {
      select = <select className="merchant-select show-dropdown-arrow" onChange={ (e) => this.props.selectMerchant(e) }>
                 <option value="0">Current Month</option>
                 <option value="1" selected>1 Month Ago</option>
                 <option value="2">2 Months Ago</option>
               </select>;
    } else if (currentMerchant === 2) {
      select = <select className="merchant-select show-dropdown-arrow" onChange={ (e) => this.props.selectMerchant(e) }>
                 <option value="0">Current Month</option>
                 <option value="1">1 Month Ago</option>
                 <option value="2" selected>2 Months Ago</option>
               </select>;
    } else {
      select = <select className="merchant-select show-dropdown-arrow" onChange={ (e) => this.props.selectMerchant(e) }>
                 <option value="0" selected>Current Month</option>
                 <option value="1">1 Month Ago</option>
                 <option value="2">2 Months Ago</option>
               </select>;
    } 


    return(
      <div>

        <div className="main-div">

          <header className="navbar bar bar-nav">
            <h1 className="navbar-title title">Moolabeast</h1>
          </header>
          
          <div className="main-content-div content">
            <center>
              <h1 className="merchants-h1 grey thin-font">Expenses by Merchant</h1>
            </center>
            <center>  

              {select}

            </center>
            <div className="card">
              <table className="merchant-table table table-striped">
                <thead>
                  <tr>
                    <th className="align-left">Merchant</th>
                    <th className="align-left">Transactions</th>
                    <th className="align-left">Amount</th>
                  </tr>
                </thead>

                <tbody className="merchant-table-body">

                  { tableRows }

                </tbody>
              </table>
            </div>
            <br/><br/><br/><br/><br/>
          </div>
          
          <nav className="bar bar-tab">

            <div className="tab-item">              
              <Link to="/CashFlow" style={ inactiveIcon }>
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
              <Link to="/Merchants" style={ activeIcon }>
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

export default Merchants;
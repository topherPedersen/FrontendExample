import React from 'react';
import 'jquery/dist/jquery.min.js';
import 'goratchet/dist/css/ratchet.min.css';
/* import './link-initialize.js'; */
import {Chart} from 'chart.js/dist/Chart.bundle.min.js';
import './MoneyPhone.css';
import Modal from './Modal';
import Login from './Login';
import CashFlow from './CashFlow';
import History from './History';
import Categories from './Categories';
import Merchants from './Merchants';
import Signup from './Signup';
/* import LinkBankAccount from './LinkBankAccount'; */
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import MoneyPhoneConfig from './MoneyPhoneConfig.js';

class MoneyPhone extends React.Component {
  constructor(props) {
    super(props);

    var storedEmail;
    if (localStorage.email != undefined) {
      storedEmail = localStorage.email;
    } else {
      storedEmail = "";
    }

    this.state = {
      loggedIn: false,
      shouldDisplayLoadingModal: false,
      email: storedEmail,
      password: "",
      income: 0.0,
      expenses: 0.0,
      cashflow: 0.0,
      incomeStr: "0.00",
      expensesStr: "0.00",
      cashflowStr: "0.00",
      cashflowSign: "",
      incomeOneMonthAgo: 0.0,
      expensesOneMonthAgo: 0.0,
      cashflowOneMonthAgo: 0.0,
      incomeTwoMonthsAgo: 0.0,
      expensesTwoMonthsAgo: 0.0,
      cashflowTwoMonthsAgo: 0.0,
      currentCategory: 0,
      currentMerchant: 0,
      currentMonth: 0,
      all: {} // all includes everything returned from the server
    };
  }

  handleLogin(email, password, data) {

    // Log info for debugging/development purposes
    console.log("handleLogin() called");
    console.log("email: " + email);
    console.log("password: " + password);

    // Update State to Reflect User Has "loggedIn"
    var oldState = this.state;
    var newState = oldState;
    newState.loggedIn = true;
    newState.email = email;
    newState.password = password;
    newState.shouldDisplayLoadingModal = false;
    newState.income = data.cashflow.income;
    newState.expenses = data.cashflow.expenses;
    newState.cashflow = data.cashflow.cashflow;
    // This crazy code... .toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') 
    // simply turns a number like 3.987987978897 into a dollar friendly   
    // format such as 3.98                                                
    newState.incomeStr = data.cashflow.income.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
    newState.expensesStr = data.cashflow.expenses.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    newState.cashflowStr = Math.abs(data.cashflow.cashflow).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    newState.cashflowSign = data.cashflow.cashflow >= 0 ? "" : "-"; // if cashflow is negative, assign a negative value sign
    newState.incomeOneMonthAgo = data.history.income_one_month_ago;
    newState.expensesOneMonthAgo = data.history.expenses_one_month_ago;
    newState.cashflowOneMonthAgo = data.history.cashflow_one_month_ago;
    newState.incomeTwoMonthsAgo = data.history.income_two_months_ago;
    newState.expensesTwoMonthsAgo = data.history.expenses_two_months_ago;
    newState.cashflowTwoMonthsAgo = data.history.cashflow_two_months_ago;
    newState.currentCategory = 0;
    newState.currentMerchant = 0;
    newState.currentMonth = 0;
    newState.all = data; // all includes all data returned from the server

    // Check to see if the user has any financial history linked to 
    // his or her account
    var noFinancialHistory = true;
    if (newState.income > 1.50) {
      noFinancialHistory = false;
    }
    if (newState.expenses > 1.50) {
      noFinancialHistory = false;
    }
    if (newState.incomeOneMonthAgo > 1.50) {
      noFinancialHistory = false;
    }
    if (newState.expensesOneMonthAgo > 1.50) {
      noFinancialHistory = false;
    }
    if (newState.incomeTwoMonthsAgo > 1.50) {
      noFinancialHistory = false;
    }
    if (newState.expensesTwoMonthsAgo > 1.50) {
      noFinancialHistory = false;
    }

    // If user has no financial data to show, add 3 dummy transactions
    // from Foo Corporation, Bar Incorporated, and Baz Limited for 
    // presentation purposes so the user can see what the app would look
    // like if they were to link their bank account.
    if (noFinancialHistory) {

      newState.income = 0.99;    
      newState.incomeOneMonthAgo = 0.88;    
      newState.incomeTwoMonthsAgo = 0.97;    
      newState.expenses = 0.75;    
      newState.expensesOneMonthAgo = 0.67;    
      newState.expensesTwoMonthsAgo = 0.90;  

      // Create empty arrays and json objects since none were created
      // when logging in as the user has no financial history
      newState.all.merchant_0 = [];
      newState.all.merchant_1 = [];
      newState.all.merchant_2 = [];
      newState.all.merchant_0[0] = {};
      newState.all.merchant_0[1] = {};
      newState.all.merchant_0[2] = {};
      newState.all.merchant_1[0] = {};
      newState.all.merchant_1[1] = {};
      newState.all.merchant_1[2] = {};
      newState.all.merchant_2[0] = {};
      newState.all.merchant_2[1] = {};
      newState.all.merchant_2[2] = {};

      // add dummy financial data
      newState.all.merchant_0[0].name = "Foo Corporation";
      newState.all.merchant_0[0].number_of_transactions = 3;
      newState.all.merchant_0[0].amount_spent = 0.50;
      newState.all.merchant_0[1].name = "Bar Incorporated";
      newState.all.merchant_0[1].number_of_transactions = 2;
      newState.all.merchant_0[1].amount_spent = 0.20;
      newState.all.merchant_0[2].name = "Baz Limited";
      newState.all.merchant_0[2].number_of_transactions = 1;
      newState.all.merchant_0[2].amount_spent = 0.05;
      newState.all.merchant_1[0].name = "Foo Corporation";
      newState.all.merchant_1[0].number_of_transactions = 3;
      newState.all.merchant_1[0].amount_spent = 0.50;
      newState.all.merchant_1[1].name = "Bar Incorporated";
      newState.all.merchant_1[1].number_of_transactions = 2;
      newState.all.merchant_1[1].amount_spent = 0.10;
      newState.all.merchant_1[2].name = "Baz Limited";
      newState.all.merchant_1[2].number_of_transactions = 1;
      newState.all.merchant_1[2].amount_spent = 0.07;
      newState.all.merchant_2[0].name = "Foo Corporation";
      newState.all.merchant_2[0].number_of_transactions = 3;
      newState.all.merchant_2[0].amount_spent = 0.30;
      newState.all.merchant_2[1].name = "Bar Incorporated";
      newState.all.merchant_2[1].number_of_transactions = 2;
      newState.all.merchant_2[1].amount_spent = 0.30;
      newState.all.merchant_2[2].name = "Baz Limited";
      newState.all.merchant_2[2].number_of_transactions = 1;
      newState.all.merchant_2[2].amount_spent = 0.30;
    }

    this.setState(newState);
  }

  handleRefreshData(email, password, oldState) {

    // Log info for debugging/development purposes
    console.log("handleRefreshData called!");
    console.log("email: " + email);
    console.log("password: " + password);

    // BUG FIX USING 'that'
    // Uncaught TypeError: this.setState is not a function at XMLHttpRequest.httpRequest.onreadystatechange
    // REFERENCE: https://stackoverflow.com/questions/31045716/react-this-setstate-is-not-a-function
    var that = this;

    // Fetch Fresh Financial Data via AJAX
    console.log("fetching fresh financial data via ajax...");
    var httpRequest = new XMLHttpRequest();
    var httpRequestURL = MoneyPhoneConfig.domain + "/login";
    httpRequest.open("POST", httpRequestURL, true);
    httpRequest.onreadystatechange = function(login) {
      if (this.readyState == 4 && this.status == 200) {
        // Get Response Data
        var data = this.responseText;
        data = JSON.parse(data); 
        // Update State With Fresh Financial Data HERE
        var newState = oldState;
        newState.shouldDisplayLoadingModal = false;
        newState.income = data.cashflow.income;
        newState.expenses = data.cashflow.expenses;
        newState.cashflow = data.cashflow.cashflow;
        // This crazy code... .toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') 
        // simply turns a number like 3.987987978897 into a dollar friendly   
        // format such as 3.98                                                
        newState.incomeStr = data.cashflow.income.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        newState.expensesStr = data.cashflow.expenses.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        newState.cashflowStr = Math.abs(data.cashflow.cashflow).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        newState.cashflowSign = data.cashflow.cashflow >= 0 ? "" : "-"; // if cashflow is negative, assign a negative value sign
        newState.incomeOneMonthAgo = data.history.income_one_month_ago;
        newState.expensesOneMonthAgo = data.history.expenses_one_month_ago;
        newState.cashflowOneMonthAgo = data.history.cashflow_one_month_ago;
        newState.incomeTwoMonthsAgo = data.history.income_two_months_ago;
        newState.expensesTwoMonthsAgo = data.history.expenses_two_months_ago;
        newState.cashflowTwoMonthsAgo = data.history.cashflow_two_months_ago;
        newState.currentCategory = 0;
        newState.currentMerchant = 0;
        newState.currentMonth = 0;
        newState.all = data; // all includes all data returned from the server
        that.setState(newState); // update state with fresh financial data
      }
    };
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    httpRequest.send(formData);  
    
  }

  // RANDOM COLOR GENERATOR FUNCTION REFERENCE...
  // https://stackoverflow.com/questions/25594478/different-color-for-each-bar-in-a-bar-chart-chartjs
  randomColorGenerator() { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
  };

  renderPieChart() {
    console.log("renderPieChart");

    // select appropriate option depending on which month is selected
    document.getElementsByClassName('category-select')[0].value = this.state.currentCategory.toString(); 
    
    var numberOfCategories;
    var category;
    if (this.state.currentCategory === 0) {
      numberOfCategories = this.state.all.category_0.length;
      category = this.state.all.category_0;
    } else if (this.state.currentCategory === 1) {
      numberOfCategories = this.state.all.category_1.length;
      category = this.state.all.category_1;
    } else if (this.state.currentCategory === 2) {
      numberOfCategories = this.state.all.category_2.length;
      category = this.state.all.category_2;
    } else {
      numberOfCategories = 0;
    }

    var newListItem;
    var nextCategory;
    var nextTransactionCount;
    var nextDollarAmount;
    var nameKey;
    var transactionKey;
    var amountKey;
    var categoryChartLabel = new Array();
    var categoryChartData = new Array();
    var categoryChartBackgroundColor = new Array();

    // Loop Through Categories and Append to New Array
    // This Array will be used to Contruct our Pie Chart
    for (var i = 0; i < numberOfCategories; i++) {
        categoryChartLabel[i] = category[i].name;
        categoryChartData[i] = parseInt(category[i].amount_spent);
        categoryChartBackgroundColor[i] = this.randomColorGenerator();
    }
    
    // Fill Chart With Placeholder Data if No Spending Data Present
    if (numberOfCategories <= 0) {

        categoryChartLabel[0] = "Foo";
        categoryChartData[0] = parseInt(1);
        categoryChartBackgroundColor[0] = this.randomColorGenerator();

        categoryChartLabel[1] = "Bar";
        categoryChartData[1] = parseInt(1);
        categoryChartBackgroundColor[1] = this.randomColorGenerator();

        categoryChartLabel[2] = "Baz";
        categoryChartData[2] = parseInt(1);
        categoryChartBackgroundColor[2] = this.randomColorGenerator();   
    }

    var data = {
        datasets: [{
            data: categoryChartData,
            backgroundColor: categoryChartBackgroundColor
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: categoryChartLabel
    };

    var categoryChartCanvas = document.getElementsByClassName('category-chart')[0].getContext('2d');
    // For a pie chart
    var myPieChart = new Chart(categoryChartCanvas, {
        type: 'pie',
        data: data,
        options: {
            maintainAspectRatio: false
        }
    });
  }

  handleSelectCategory(e) {
    console.log("handleSelectCategory called!");
    var categorySelected = e.target.value;
    e.target.selected = true;
    var oldState = this.state;
    var newState = oldState;
    newState.currentCategory = parseInt(categorySelected);
    this.setState(newState);
    this.renderPieChart();
  }

  handleSelectMerchant(e) {
    console.log("handleSelectMerchant called!");
    var merchantSelected = e.target.value;
    e.target.selected = true;
    var oldState = this.state;
    var newState = oldState;
    newState.currentMerchant = parseInt(merchantSelected);
    console.log("Merchant Number Selected: " + merchantSelected);
    this.setState(newState);
  }

  handlePresentLoadingModal() {
    // Display Loading Modal
    console.log("handlePresentLoadingModal!");
    var oldState = this.state;
    var newState = oldState;
    newState.shouldDisplayLoadingModal = true;
    this.setState(newState);
  }

  handleCloseLoadingModal() {
    // Close Loading Modal
    console.log("handleCloseLoadingModal!");
    var oldState = this.state;
    var newState = oldState;
    newState.shouldDisplayLoadingModal = false;
    this.setState(newState);
  }

  handleLoginOnSignup(email, password, oldState) {
    // Log info for debugging/development purposes
    console.log("handleLoginOnSignup called!");
    console.log("email: " + email);
    console.log("password: " + password);

    // BUG FIX USING 'that'
    // Uncaught TypeError: this.setState is not a function at XMLHttpRequest.httpRequest.onreadystatechange
    // REFERENCE: https://stackoverflow.com/questions/31045716/react-this-setstate-is-not-a-function
    var that = this;

    var previousState = oldState;

    /*
    console.log("previousState.email => " + previousState.email);
    console.log("previousState.password => " + previousState.password);
    */

    // Fetch Fresh Financial Data via AJAX
    console.log("fetching fresh financial data via ajax...");
    var httpRequest = new XMLHttpRequest();
    var httpRequestURL = MoneyPhoneConfig.domain + "/login";
    httpRequest.open("POST", httpRequestURL, true);
    httpRequest.onreadystatechange = function(login) {
      console.log("handleLoginOnSignup making ajax request...");
      if (this.readyState == 4 && this.status == 200) {

        console.log("handleLoginOnSignup Has Received Server Response to AJAX Request...");

        // Get Response Data
        var data = this.responseText;
        data = JSON.parse(data); 

        console.log("Income Data (should be zero): " + data.cashflow.income.toString());
        console.log("Expense Data (should be zero): " + data.cashflow.expenses.toString());
        console.log("Cashflow Data (should be zero): " + data.cashflow.cashflow.toString());

        // Update State With Fresh Financial Data HERE
        var newState = previousState;
        newState.loggedIn = true;
        newState.email = email;
        newState.password = password;
        newState.shouldDisplayLoadingModal = false;
        newState.income = data.cashflow.income;
        newState.expenses = data.cashflow.expenses;
        newState.cashflow = data.cashflow.cashflow;
        // This crazy code... .toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') 
        // simply turns a number like 3.987987978897 into a dollar friendly   
        // format such as 3.98                                                
        newState.incomeStr = data.cashflow.income.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        newState.expensesStr = data.cashflow.expenses.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        newState.cashflowStr = Math.abs(data.cashflow.cashflow).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        newState.cashflowSign = data.cashflow.cashflow >= 0 ? "" : "-"; // if cashflow is negative, assign a negative value sign
        newState.incomeOneMonthAgo = data.history.income_one_month_ago;
        newState.expensesOneMonthAgo = data.history.expenses_one_month_ago;
        newState.cashflowOneMonthAgo = data.history.cashflow_one_month_ago;
        newState.incomeTwoMonthsAgo = data.history.income_two_months_ago;
        newState.expensesTwoMonthsAgo = data.history.expenses_two_months_ago;
        newState.cashflowTwoMonthsAgo = data.history.cashflow_two_months_ago;
        newState.currentCategory = 0;
        newState.currentMerchant = 0;
        newState.currentMonth = 0;
        newState.all = data; // all includes all data returned from the server

        // Check to see if the user has any financial history linked to 
        // his or her account
        var noFinancialHistory = true;
        if (newState.income > 1.50) {
          noFinancialHistory = false;
        }
        if (newState.expenses > 1.50) {
          noFinancialHistory = false;
        }
        if (newState.incomeOneMonthAgo > 1.50) {
          noFinancialHistory = false;
        }
        if (newState.expensesOneMonthAgo > 1.50) {
          noFinancialHistory = false;
        }
        if (newState.incomeTwoMonthsAgo > 1.50) {
          noFinancialHistory = false;
        }
        if (newState.expensesTwoMonthsAgo > 1.50) {
          noFinancialHistory = false;
        }

        // If user has no financial data to show, add 3 dummy transactions
        // from Foo Corporation, Bar Incorporated, and Baz Limited for 
        // presentation purposes so the user can see what the app would look
        // like if they were to link their bank account.
        if (noFinancialHistory) {

          newState.income = 0.99;    
          newState.incomeOneMonthAgo = 0.88;    
          newState.incomeTwoMonthsAgo = 0.97;    
          newState.expenses = 0.75;    
          newState.expensesOneMonthAgo = 0.67;    
          newState.expensesTwoMonthsAgo = 0.90;  

          // Create empty arrays and json objects since none were created
          // when logging in as the user has no financial history
          newState.all.merchant_0 = [];
          newState.all.merchant_1 = [];
          newState.all.merchant_2 = [];
          newState.all.merchant_0[0] = {};
          newState.all.merchant_0[1] = {};
          newState.all.merchant_0[2] = {};
          newState.all.merchant_1[0] = {};
          newState.all.merchant_1[1] = {};
          newState.all.merchant_1[2] = {};
          newState.all.merchant_2[0] = {};
          newState.all.merchant_2[1] = {};
          newState.all.merchant_2[2] = {};

          // add dummy financial data
          newState.all.merchant_0[0].name = "Foo Corporation";
          newState.all.merchant_0[0].number_of_transactions = 3;
          newState.all.merchant_0[0].amount_spent = 0.50;
          newState.all.merchant_0[1].name = "Bar Incorporated";
          newState.all.merchant_0[1].number_of_transactions = 2;
          newState.all.merchant_0[1].amount_spent = 0.20;
          newState.all.merchant_0[2].name = "Baz Limited";
          newState.all.merchant_0[2].number_of_transactions = 1;
          newState.all.merchant_0[2].amount_spent = 0.05;
          newState.all.merchant_1[0].name = "Foo Corporation";
          newState.all.merchant_1[0].number_of_transactions = 3;
          newState.all.merchant_1[0].amount_spent = 0.50;
          newState.all.merchant_1[1].name = "Bar Incorporated";
          newState.all.merchant_1[1].number_of_transactions = 2;
          newState.all.merchant_1[1].amount_spent = 0.10;
          newState.all.merchant_1[2].name = "Baz Limited";
          newState.all.merchant_1[2].number_of_transactions = 1;
          newState.all.merchant_1[2].amount_spent = 0.07;
          newState.all.merchant_2[0].name = "Foo Corporation";
          newState.all.merchant_2[0].number_of_transactions = 3;
          newState.all.merchant_2[0].amount_spent = 0.30;
          newState.all.merchant_2[1].name = "Bar Incorporated";
          newState.all.merchant_2[1].number_of_transactions = 2;
          newState.all.merchant_2[1].amount_spent = 0.30;
          newState.all.merchant_2[2].name = "Baz Limited";
          newState.all.merchant_2[2].number_of_transactions = 1;
          newState.all.merchant_2[2].amount_spent = 0.30;
        }

        that.setState(newState); // update state with fresh financial data
      }
    };
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    httpRequest.send(formData);  
  }

  handlePromptGuestToLogout() {

    // If a user browsing as guest clicks the "link bank account" button,
    // prompt him or her to logout in order to register an account.

    // var message = "Thanks for checking out Moolabeast! It looks like you are currently browsing the app as a guest, and have not yet created an account. If you would like to link your credit or debit card so you can start tracking your spending automatically with Moolabeast, please press 'OK' to logout and register an account. Press 'CANCEL' to continue browsing as guest.";
    var message = "Thanks for checking out Moolabeast! Since you are currently browsing the app as a guest, we will first need you to register an account before linking any debit or credit cards.";
    alert(message);

    // set loggedIn to false, and setState (this will bring the user back to the signup screen)
    var loggedOutState = {
      loggedIn: false,
      shouldDisplayLoadingModal: false,
      email: "",
      password: "",
      income: 0.0,
      expenses: 0.0,
      cashflow: 0.0,
      incomeStr: "0.00",
      expensesStr: "0.00",
      cashflowStr: "0.00",
      cashflowSign: "",
      incomeOneMonthAgo: 0.0,
      expensesOneMonthAgo: 0.0,
      cashflowOneMonthAgo: 0.0,
      incomeTwoMonthsAgo: 0.0,
      expensesTwoMonthsAgo: 0.0,
      cashflowTwoMonthsAgo: 0.0,
      currentCategory: 0,
      currentMerchant: 0,
      currentMonth: 0,
      all: {} // all includes everything returned from the server
    }
    // make sure to clear localStorage so the user is redirected to the signup screen 
    // and not the login screen
    localStorage.clear(); 
    this.setState(loggedOutState);
  }

  render() {

    // If user has never logged in before, display <Signup/> instead of <Login/>
    if ( (localStorage.email === undefined || localStorage.email === "") || (localStorage.password === undefined || localStorage.password === "") ) {
      return(
        <main>
          <Router>
            <Switch>
              <Route path="/Login">
                <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                <Login 
                  updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
              </Route>
              <Route path="/Signup">
                <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                <Signup
                  oldState={ this.state }
                  updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                  loginOnSignup={ (email, password, oldState) => this.handleLoginOnSignup(email, password, oldState) }
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
              </Route>
              <Route path="/">
                <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                <Signup
                  oldState={ this.state }
                  updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                  loginOnSignup={ (email, password, oldState) => this.handleLoginOnSignup(email, password, oldState) }
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
              </Route>
            </Switch>
          </Router>
        </main>
      );
    }

    // If user is not logged in, display <Login/>
    var loggedIn = this.state.loggedIn;
    if (!loggedIn) {

      // If the user previously logged in via the skip-signup-button,
      // Show them the <Signup/> component and not the <Login/> component
      if (localStorage.email == "skip@moolabeast.com") {
        // This is very ugly, but if someone opens the app up again after previously
        // using the skip login button, render the <Router> below so they are prompted
        // with the sign-up page instead of the login page. (adding the skip signup 
        // feature has sort of thrown off the previous <Router> / user login flow,
        // but since this Cordova version of the app is being replaced with the new
        // React Native version, this work around will suffice.
        return(
          <main>
            <Router>
              <Switch>
                <Route path="/Login">
                  <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                  <Login 
                    updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                    presentLoadingModal={ () => this.handlePresentLoadingModal() }
                    closeLoadingModal={ () => this.handleCloseLoadingModal() }
                    shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
                </Route>
                <Route path="/Signup">
                  <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                  <Signup
                    oldState={ this.state }
                    updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                    loginOnSignup={ (email, password, oldState) => this.handleLoginOnSignup(email, password, oldState) }
                    presentLoadingModal={ () => this.handlePresentLoadingModal() }
                    closeLoadingModal={ () => this.handleCloseLoadingModal() }
                    shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
                </Route>
                <Route path="/">
                  <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                  <Signup
                    oldState={ this.state }
                    updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                    loginOnSignup={ (email, password, oldState) => this.handleLoginOnSignup(email, password, oldState) }
                    presentLoadingModal={ () => this.handlePresentLoadingModal() }
                    closeLoadingModal={ () => this.handleCloseLoadingModal() }
                    shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
                </Route>
              </Switch>
            </Router>
          </main>
        );
      }

      // Present real users who have signup before the standard route, typically the <Login/> component
      return(
        <main>
          <Router>
            <Switch>
              <Route path="/Signup">
                <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                <Signup
                  oldState={ this.state }
                  updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                  loginOnSignup={ (email, password, oldState) => this.handleLoginOnSignup(email, password, oldState) }
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } />
              </Route>
              <Route path="/Login">
                <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                <Login 
                  updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal }  />
              </Route>
              <Route path="/">
                <Modal shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal } email={ this.state.email } />
                <Login 
                  updateLoginState={ (email, password, otherStuff) => this.handleLogin(email, password, otherStuff) } 
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal }  />
              </Route>
            </Switch>
          </Router>
        </main>
      );
    }

    // If the user is logged in and currently viewing 
    // the home (/) route, then redirect to <CashFlow/>
    return(
      <main>
        <Router>
            <Switch>

              <Route path="/CashFlow">
                <CashFlow 
                  data={this.state} 
                  oldState={this.state}
                  presentLoadingModal={ () => this.handlePresentLoadingModal() }
                  closeLoadingModal={ () => this.handleCloseLoadingModal() }
                  shouldDisplayLoadingModal={ this.state.shouldDisplayLoadingModal }
                  refreshData={ (email, password, oldState) => this.handleRefreshData(email, password, oldState) } 
                  promptGuestToLogout={ () => this.handlePromptGuestToLogout() } />
              </Route>

              <Route path="/History">
                <History data={this.state} />
              </Route>

              <Route path="/Categories">
                <Categories data={this.state} selectCategory={ (e, renderPieChart) => this.handleSelectCategory(e, renderPieChart) } />
              </Route>

              <Route path="/Merchants">
                <Merchants data={this.state} selectMerchant={ (e) => this.handleSelectMerchant(e) } />
              </Route>

              <Route path="/Signup">
                <Redirect to="CashFlow"/>
              </Route>

              <Route path="/">
                <Redirect to="/CashFlow"/>
              </Route>

            </Switch>
        </Router>
      </main>
    );
  }
}

export default MoneyPhone;
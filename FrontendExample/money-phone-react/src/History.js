import React from 'react';
import 'goratchet/dist/css/ratchet.min.css';
import {Chart} from 'chart.js/dist/Chart.bundle.min.js';
import './MoneyPhone.css';
import './MoneyIcons.css';
import CashFlow from './CashFlow';
import Categories from './Categories';
import Merchants from './Merchants';
import Modal from './Modal';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class History extends React.Component {

    componentDidMount() {

      var income = this.props.data.income;
      var expenses = this.props.data.expenses;
      var cashflow = this.props.data.cashflow;

      var incomeOneMonthAgo = this.props.data.incomeOneMonthAgo;
      var expensesOneMonthAgo = this.props.data.expensesOneMonthAgo;
      var cashflowOneMonthAgo = this.props.data.cashflowOneMonthAgo;

      var incomeTwoMonthsAgo = this.props.data.incomeTwoMonthsAgo;
      var expensesTwoMonthsAgo = this.props.data.expensesTwoMonthsAgo;
      var cashflowTwoMonthsAgo = this.props.data.cashflowTwoMonthsAgo;

      console.log("Testing History.js... INCOME: " + income);
      console.log("Testing History.js... EXPENSES: " + expenses);
      console.log("Testing History.js... CASHFLOW: " + cashflow);

      console.log("Testing History.js... incomeOneMonthAgo: " + incomeOneMonthAgo);
      console.log("Testing History.js... expensesOneMonthAgo: " + expensesOneMonthAgo);
      console.log("Testing History.js... cashflowOneMonthAgo: " + cashflowOneMonthAgo);

      console.log("Testing History.js... incomeTwoMonthsAgo: " + incomeTwoMonthsAgo);
      console.log("Testing History.js... expensesTwoMonthsAgo: " + expensesTwoMonthsAgo);
      console.log("Testing History.js... cashflowTwoMonthsAgo: " + cashflowTwoMonthsAgo);



      // SIX MONTH SPENDING HISTORY CHART
      var ctx2 = document.getElementsByClassName('six-month-spending-history-chart')[0].getContext('2d');
      var myChart2 = new Chart(ctx2, {
          type: 'line',
          data: {
              labels: [
                  '2 Months Ago', 
                  '1 Month Ago', 
                  'Current Month'
              ],
              datasets: [{
                  label: 'Expenditures',
                  data: [
                      expensesTwoMonthsAgo, 
                      expensesOneMonthAgo,
                      expenses
                  ],
                  backgroundColor: [
                      'rgba(255, 0, 0, 0.95)'
                  ],
                  borderColor: [
                      'rgba(255, 0, 0, 0.95)'
                  ],
                      borderWidth: 1
                  },
                  {
                  label: 'Income',
                  data: [
                      incomeTwoMonthsAgo, 
                      incomeOneMonthAgo,
                      income
                  ],
                  backgroundColor: [
                      'rgba(57, 255, 20, 1)'
                  ],
                  borderColor: [
                      'rgba(57, 255, 20, 1)'
                  ],
                      borderWidth: 1
                  }
              ]},
          options: {
              maintainAspectRatio: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              },
              elements: {
                  line: {
                      tension: 0 // disables bezier curves
                  }
              }
          }
      });

    }


  render() {

    var activeIcon = {
      color: "#23e000"
    };

    var inactiveIcon = {
      color: "#656464"
    };

    var canvasStyle = {
      width: parseInt(window.outerWidth * 0.95).toString() + "px",
      height: parseInt(window.outerWidth * 0.75).toString() + "px"
    };

    return(
      <div>

        <div className="main-div">

          <header className="navbar bar bar-nav">
            <h1 className="navbar-title title">Moolabeast</h1>
          </header>
          
          <div className="main-content-div content">


            <div className="history-div-container-wrapper">
              <div className="history-div-container vertical-center">

                <center>
                  <h1 className="history-h1 grey thin-font">3 Month History of Cash Flows</h1>
                </center>
                    
                <center>
                  <div className="spendingHistoryChartDiv" style={ {position: "relative", width: "98%"} }>
                    <canvas 
                      className="six-month-spending-history-chart"
                      style={ canvasStyle }
                    ></canvas>
                  </div>
                </center>
              </div>
            </div>

          </div>
          
          <nav className="bar bar-tab">

            <div className="tab-item">              
              <Link to="/CashFlow" style={ inactiveIcon }>
                <span className="icon flaticon-credit-card-5 icon-mod"></span>
                <span className="tab-label light-font">Cash Flow</span>
              </Link>
            </div>

            <div className="tab-item">
              <Link to="/History" style={ activeIcon }>
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

export default History;
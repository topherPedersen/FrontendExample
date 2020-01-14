import React from 'react';
import 'goratchet/dist/css/ratchet.min.css';
import {Chart} from 'chart.js/dist/Chart.bundle.min.js';
import './MoneyPhone.css';
import './MoneyIcons.css';
import CashFlow from './CashFlow';
import History from './History';
import Merchants from './Merchants';
import Modal from './Modal';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Categories extends React.Component {
  // RANDOM COLOR GENERATOR FUNCTION REFERENCE...
  // https://stackoverflow.com/questions/25594478/different-color-for-each-bar-in-a-bar-chart-chartjs
  randomColorGenerator() { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
  };

  componentDidMount() {

    console.log("<Categories/> componentDidMount");

    // select appropriate option depending on which month is selected
    document.getElementsByClassName('category-select')[0].value = this.props.data.currentCategory.toString(); 
    
    var numberOfCategories;
    var category;
    if (this.props.data.currentCategory === 0) {
      numberOfCategories = this.props.data.all.category_0.length;
      category = this.props.data.all.category_0;
    } else if (this.props.data.currentCategory === 1) {
      numberOfCategories = this.props.data.all.category_1.length;
      category = this.props.data.all.category_1;
    } else if (this.props.data.currentCategory === 2) {
      numberOfCategories = this.props.data.all.category_2.length;
      category = this.props.data.all.category_2;
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

  render() {

    var activeIcon = {
      color: "#23e000"
    }

    var inactiveIcon = {
      color: "#656464"
    }

    // Old CanvasStyle: {position: "relative", width: "98%"}
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
            <div className="categories-div-container-wrapper">
              <div className="categories-div-container vertical-center">

                <center>
                  <h1 className="categories-h1 grey thin-font">
                    Expenses by Category
                  </h1>

                </center>

                <center>

                  <select className="category-select show-dropdown-arrow" onChange={ (e) => this.props.selectCategory(e, this.renderPieChart) }>
                    <option value="0">Current Month</option>
                    <option value="1">1 Month Ago</option>
                    <option value="2">2 Months Ago</option>
                  </select>

                </center>

                <center>
                  <div className="categoryChartDiv" style={ canvasStyle }>
                    <canvas className="category-chart"></canvas>
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
              <Link to="/History" style={ inactiveIcon }>
                <span className="icon flaticon-graph-5 icon-mod"></span>
                <span className="tab-label light-font">History</span>
              </Link>
            </div>

            <div className="tab-item">
              <Link to="/Categories" style={ activeIcon }>
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

export default Categories;
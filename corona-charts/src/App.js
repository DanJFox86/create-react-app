import React, { Component } from 'react';
import logo from './logo.svg';
import ChartModule from './Chart-module.js';
import Chart from 'chart.js';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    let ctx = document.getElementById('myChart');
    if(myChart) {
      myChart.destroy();
    }
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
    },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });

  }


  render() {
    // var ctx = document.getElementById('myChart');
    // console.log(`here's the data we are working with `, this.state.data);
    let labels = [];
    let data = [];
    // if (this.state.data.length > -1) {
    //   this.state.data.forEach((dataPoint) => {
    //     labels.push(dataPoint[0]);
    //     data.push(dataPoint[1]);
    //   });
    // }
    return (
      <div className="App">
        <div className="left-container">
          <div>Left Container</div>
        </div>
        <div className="middle-container">
          <div className="middle-container-top">
            <canvas id="myChart" className="main-chart"></canvas>
          </div>
          <div className="middle-container-bottom">Bottom Container</div>
        </div>
        <div className="right-container">
          <div>Right Container</div>
        </div>
        {/* <header className="App-header">      
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    );
  }
}

export default App;

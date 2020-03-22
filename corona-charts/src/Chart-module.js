import React, { Component } from 'react';
import Chart from 'chart.js';

class ChartModule extends Component {
  constructor() {
    super();
  }
  render() {
    var ctx = document.getElementById('myChart');
    console.log(ctx)
    // console.log(`here's the data we are working with `, this.state.data);
    let labels = [];
    let data = [];
    // if (this.state.data.length > -1) {
    //   this.state.data.forEach((dataPoint) => {
    //     labels.push(dataPoint[0]);
    //     data.push(dataPoint[1]);
    //   });
    // }
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
            borderWidth: 1
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
    return ( <div></div>
    );
  }
}

export default ChartModule;

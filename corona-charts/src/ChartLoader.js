import React, { Component } from 'react';
import Chart from 'chart.js';

class ChartLoader extends Component {
  constructor() {
    super();
  }
  render() {
    console.log(this.props.data);
    let ctx = document.getElementById('myChart');
    console.log(ctx);
    if(myChart) {
      myChart.destroy();
    }
    let dates = [];
    this.props.data.dates.forEach((date) => {
      dates.push(date.text);
    });
    let confirmed = [];
    let deaths = [];
    let recovered = [];
    this.props.data.points.forEach((point) => {
      switch(Number(point.type_id)) {
        case 1:
          confirmed.push(point.value);
          break;
        case 2:
          deaths.push(point.value);
          break;
        case 3:
          recovered.push(point.value);
          break;
        default:
          break;
      }
    });
    dates.pop();
    confirmed.pop();
    deaths.pop();
    recovered.pop();
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
            label: 'Confirmed',
            data: confirmed,
            
            borderColor: 'rgba(0,164,0,0.8)',
            borderWidth: 2
        },
        {
          label: 'Deaths',
          data: deaths,
          borderColor: 'rgba(164,0,0,0.8)'
        },
        {
          label: 'Recovered',
          data: recovered,
          borderColor: 'rgba(0,0,164,0.8)'
        }]
    },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        },
        // onClick: this.onClick,
        tooltips: {
          mode: 'x'
        }
      }
    });
    return ( <div></div>
    );
  }
}

export default ChartLoader;

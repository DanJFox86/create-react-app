import React, { Component } from 'react';
import Chart from 'chart.js';
import './App.css';
import LeftContainer from './LeftContainer.js';

let myCovidChart;

class App extends Component {

  constructor() {
    super();
    this.state = {
      countries: [],
      states: [],
      data: { points: [{value:1, date_id:1, type_id: 1},{value:2, date_id:2, type_id: 2},{value:3, date_id:3, type_id: 3}],
              dates: [{id: 1, text: '03/18/2020'},{id: 2, text: '03/19/2020'},{id: 3, text: '03/20/2020'}],
              types: [{id: 1, name: 'confirmed'},{id: 2, name: 'deaths'},{id: 3, name: 'recovered'}]
            },
      focus: {
        index: -1,
        type_id: 0
      }
    };
    this.displayStateData = this.displayStateData.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.buildChart = this.buildChart.bind(this);
    this.onClick = this.onClick.bind(this);
    this.countryClick = this.countryClick.bind(this);
  }

  chartRef = React.createRef();

  componentDidMount() {
    // fetch('http://localhost:3000/89')
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     // this.renderChart(data);
    //     this.setState( { data }, this.buildChart);
    //     // this.buildChart();
    //   });
    fetch('http://localhost:3000/initialize')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.rows;
      })
      .then((countries) => {
        // console.log(countries);
        this.setState( { countries } );
      });
        // this.renderChart(data);
        // this.setState( { countries });
        // this.buildChart();
  }

  // componentDidUpdate() {
  //   this.buildChart();
  // }

  displayStateData() {
    console.log(this.state.data);
  }
  
  onClick(context) {
    if (myCovidChart.getElementAtEvent(context).length > 0) {
      let focus = {};
      console.log(myCovidChart.getElementAtEvent(context)[0])
      focus.index = myCovidChart.getElementAtEvent(context)[0]._index;
      focus.type_id = myCovidChart.getElementAtEvent(context)[0]._datasetIndex;
      this.setState( { focus } );
    }

    // state.setState( { index } );
  }

  renderChart(data) {
    let ctx = document.getElementById('myChart');
    let onClick = this.onClick;
    if(myChart) {
      myChart.destroy();
    }
    let dates = [];
    this.state.data.dates.forEach((date) => {
      dates.push(date.text);
    });
    let confirmed = [];
    let deaths = [];
    let recovered = [];
    this.state.data.points.forEach((point) => {
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
        onClick: onClick,
        tooltips: {
          mode: 'x'
        }
      }
    });
  }

  buildChart() {
    const myChartRef = this.chartRef.current.getContext("2d");
    if (typeof myCovidChart !== "undefined") myCovidChart.destroy();
    let dates = [];
    this.state.data.dates.forEach((date) => {
      dates.push(date.text);
    });
    let confirmed = [];
    let deaths = [];
    let recovered = [];
    this.state.data.points.forEach((point) => {
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
      }
    });

    myCovidChart = new Chart(myChartRef, {
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
        onClick: this.onClick,
        tooltips: {
          mode: 'x'
        }
      }
    });

  }

  countryClick(e) {
    let { value } = e.target;
    let countryPath = `http://localhost:3000/country/${value}`;
    console.log(countryPath);
    fetch(countryPath)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // this.renderChart(data);
        this.setState( { data }, this.buildChart);
        // this.buildChart();
      });
  }

  render() {
    let value = '--';
    let date = '--/--/--';
    let type = '--';
    let { index, type_id } = this.state.focus;
    if (index > -1) {
      // console.log(this.state.data.points[index].value)
      let date_id = this.state.data.dates[index].id;
      type_id += 1;
      for(let i = 0; i < this.state.data.points.length; i++) {
        if (this.state.data.points[i].date_id === date_id && this.state.data.points[i].type_id === type_id) {
          value = this.state.data.points[i].value;
        }
      }
      date = this.state.data.dates[index].text;
      type = this.state.data.types[type_id - 1].name;
    //   date = this.state.data.dates[this.state.index].text;
    //   type = this.state.data.types[type_id - 1];
    }
    return (
      <div className="App">
        <LeftContainer countryClick={this.countryClick} countries={this.state.countries}/>
        <div className="middle-container">
          <div className="middle-container-top">
            <canvas
                    id="myChart"
                    ref={this.chartRef}
                    className="main-chart"
                />
          </div>
          <div className="middle-container-bottom">Bottom Container</div>
        </div>
        <div className="right-container">
          <div>Focus Index is now {this.state.index}</div>
          <div>date: {date}</div>
          <div>value: {value}</div>
          <div>type: {type}</div>
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

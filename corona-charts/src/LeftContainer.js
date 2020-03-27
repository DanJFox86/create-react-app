import React, { Component } from 'react';

class LeftContainer extends Component {

  constructor() {
    super();
  }
  
  // onClick(context) {
  //   // state.setState( { index } );
  // }

  render() {
    console.log(this.props.countries)
    let options = this.props.countries.map((country) => {
      return (<option value={country.id}>{country.name}</option>);
    });
    return (
      <div className="left-container">
        <div>Left Container</div>
        <div className="country-container">
          <label for="country-select">Choose a country:</label>
          <select onChange={this.props.countryClick} name="countries" id="country-select">
            <option value="0">--SELECT COUNTRY--</option>
            {options}
          </select>
        </div>
      </div>
    );
  }
}

export default LeftContainer;

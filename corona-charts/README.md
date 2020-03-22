This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


#TODO

## Database

- Choose database to use, mySQL. 
- Import data to DB. What format? Hmmm, let's look at the data we got:

### Data

#### Daily Reports

- Series of daily reports, each report contains accumulated totals for Confirmed, Deaths and Recovered for all Province/State, Country/Regions effected.
- Can use this data to build time series charts for every country and states/provinces.

#### Time Series

- Contains 3 reports, each contains rows that are time series for each state/Region/Country of accumulated Confirmed, Deaths and Recovered, respectively. Pretty much just a different format of the data found in Daily Reports.

*\*Also want to also create a graph to show daily increase/decrease in each case. Looks like it would be easier to deduce this from the data in Time Series.*

### Archived Data

- At a glance, it appears to be the same data in the 'data' folder, no need to go thru it.

### Data Format

- Going to make it look something like this:
```
let dataPoint = {
  state: state_id,
  country: country_id,
  confirmed: number,
  confirmedDelta: number,
  deaths: number,
  deathsDelta: number,
  recovered: number,
  recoveredDelta: number
}
```
Deltas are difference from the day before, calculated when new data is entered into DB. I want to be able to see 2 trends really, time series for each country of each accumulated total and another for time series for each country of daily changes in totals. Calculating for new data won't have any effect on server performance. Pre-calculating this data will reduce complexity when server is sending data and client is displaying it.



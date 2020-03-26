// const { createMenu, createDish, foodCategories, mainCategories, mainCategoriesMap, subCatMap, subCatArr } = require('./generateData.js');
// const faker = require('faker');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const db = require('./postgresqlController.js');
// const { menuSeed, dishSeed, itemSubCatJoinSeed, connectDB, disconnectDB, truncateTables } = require('./postgresqlController.js');

let filePaths = [['./database/Data/time_series_covid19_confirmed_global.csv', 'confirmed'], ['./database/Data/time_series_covid19_deaths_global.csv', 'deaths'], ['./database/Data/time_series_covid19_recovered_global.csv', 'recovered']];
let countriesQuery = `INSERT INTO countries (name) VALUES `;
let statesQuery = `INSERT INTO states (name, country_id) VALUES `;
let dataPointQuery = `INSERT INTO data (value, type_id, country_id, state_id, date_id) VALUES `;
let typesArr = ['confirmed', 'deaths', 'recovered'];
let typesQuery = `INSERT INTO types (name) VALUES ( '${typesArr.join(`' ), ( '`)}' );`;
console.log(typesQuery);

let countriesArr = [];
let statesArr = [];
let datesArr = [];
let datesQuery = `INSERT INTO dates (text) VALUES `;
let root = {};


const formatData = (data, type) => {
  let node = root;
  // console.log(`Adding ${type} data`);
  
  data = data.split('\n');
  
  for (let i = 0; i < data.length; i++) {
    if (data[i].indexOf('Korea') > -1 || data[i].indexOf('Bahamas') > -1 || data[i].indexOf('Gambia') > -1 || data[i].indexOf('Ivoire') > -1) {
      data.splice(i, 1);
      i--;
      continue;
    }
    data[i] = data[i].split(',');
    if (i > 0) {
      data[i] = data[i].map((val, idx) => {
        if (idx < 2) {
          return val;
        } else {
          return Number(val);
        }
      });
    }
  }
  let statesList = ["WA","CA","MA","GA","TX","NJ","CO","IL","PA","VA","MD","IA","NC","AZ","IN","WI","OH","UT","VT","MN","FL","KY","LA","SC","TN","OR","KS","MO","NY","NH","D.C.","HI","OK","RI","NE","NV","CT","SD","NM","MI","DE"];
  let states = {};
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      datesArr = data[i].slice(4);
    } else {
      
      node = root;
      town = null;
      // console.log(data[i][0])
      if (data[i][0][0] === `"` || data[i][0][0] === `/`) {
        if (data[i][0][0] === `/`) { 
          town = data[i][0].slice(2);  
        } else {
          town = data[i][0].slice(1);
        }
        data[i][1] = data[i][1].slice(0, data[i][1].length - 1).trim();
        data[i].shift();
      }
      if (node[data[i][1]] === undefined) {
        node[data[i][1]] = {};
      }
      node = node[data[i][1]];
      
      if (data[i][0] !== '') {
        if (!node[data[i][0]]) {
          node[data[i][0]] = {};
        }
        node = node[data[i][0]];
      }
      if (town) {
        node.isTown = true;
        if (!states[data[i][0]]) {
          states[data[i][0]] = [];
        }
        states[data[i][0]].push(town);
        node[town] = {};
        node = node[town];
      }
      node[type] = data[i].slice(4);
      // console.log(JSON.stringify(node.confirmed));
    }
  }
  // console.log(JSON.stringify(Object.keys(states)));
}

const populateDataSet = (root, country, state) => {
  // console.log(`${state}, ${country}`);
  if (state === undefined) {
    // console.log(`${country} has no states`)
  }
  // console.log('populating dataset')
  // console.log(Object.keys(root))
  Object.keys(root).forEach((type) => {
    root[type].forEach((dataPoint, idx) => {
      dataPointQuery += `( ${dataPoint}, ${typesArr.indexOf(type) + 1}, ${countriesArr.indexOf(country) + 1}, ${state !== undefined ? statesArr.indexOf(state) + 1 : 'NULL'},  ${idx + 1}), `;
    });
  });
}

const populateQueries = () => {
  let node = root;
  
  for (let country in root) {
    if (country === undefined) {
      continue;
    }
    countriesArr.push(country)
    if (!node[country].confirmed)  {
      for (let state in root[country]) {
        if (!root[country][state].isTown) {
          statesArr.push(state);
        }
      }
    }
  }
  for (let country in root) {
    // countriesQuery += ` ( "${country}" ),`;
    node = root[country];
    if (node.confirmed) {
      populateDataSet(node, country);
      // console.log(JSON.stringify(node))
      // console.log(`${country} only has State-level totals`)
    } else {
      for (let state in node) {
        node = root[country][state];
        // console.log(node)
        if (!node.isTown) {
          statesQuery += `( '${state}', ${countriesArr.indexOf(country) + 1} ), `;
          console.log(`State = ${state}`)
          console.log(JSON.stringify(node));
          populateDataSet(node, country, state);
        }
      }
    }
    
  }
  statesQuery = statesQuery.slice(0, statesQuery.length - 2) + `;`;
  countriesQuery += `( '` + countriesArr.join(`' ), ( '`) + `' );`;
  dataPointQuery = dataPointQuery.slice(0, dataPointQuery.length - 2) + `;`;
  datesQuery += `( '${datesArr.join(`' ), ( '`)}` + `' );`; 
  console.log(countriesQuery);

  // console.log(dataPointQuery);
  
  // statesQuery = statesQuery.slice(0, statesQuery.length - 1) + `;`;
  // countriesQuery = countriesQuery.slice(0, countriesQuery.length - 1) + `;`;
}

const fetchDataSingle = (filePath) => {
  console.log(`Fetching ${filePath}`);
  return fs.readFileAsync(filePath);
}

const fetchAllData = () => {
  let promises = [];
  for (let [path, type] of filePaths) {
    promises.push(fetchDataSingle(path))
  }
  
  return Promise.all(promises);
  // readfiles as promises
  
  // Promise.all(): once data fetching is done, execute callback, which would be  
}

const seedData = () => {
  fetchAllData()
  .then((dataSet) => {
    dataSet.forEach((data, idx) => {
        // console.log(data);
        console.log(`Formatting ${filePaths[idx][1]} data`);
        formatData(data.toString(), filePaths[idx][1]);
        // console.log(root)
      });
      return;
    })
    .then(() => {
      console.log('Populating queries')
      populateQueries();
      let queries = [];
      queries.push(countriesQuery);
      queries.push(statesQuery);
      queries.push(typesQuery);
      queries.push(datesQuery);
      queries.push(dataPointQuery);

      db.connectDB((err, result) => {
        if (err) {
          console.log(err);
          db.disconnectDB();
        } else {
          let promises = [];
          queries.forEach((query) => {
            promises.push(db.runQuery(query))
          });
          Promise.all(promises)
            .then((result) => {
              console.log('all queries have been run')
              db.disconnectDB();
            });
        }
      });
    })
      // console.log(JSON.stringify(Object.keys(root).sort()));
    .catch((err) => {
      console.log(err);
    });
}


seedData();

// fetchDataSingle(confirmedFilePath, (err, data) => {
//   if (err) {
//     console.log('Fetch failed: See above');
//   } else {
//     formatData(data);

//     for (let key in result) {
//       console.log(key);
//     }
//     console.log(dates);

//     // console.log(formattedData)
//   }
// });
// let dishFilePath = '/home/ec2-user/menu/database/SDC/dishes_1.csv';
// let subCatItemJoinPath = '/home/ec2-user/menu/database/SDC/subCatItemJoin_1.csv';


// let menuFile = fs.createWriteStream(menuFilePath);
// let dishFile = fs.createWriteStream(dishFilePath);
// let subCatItemJoinFile = fs.createWriteStream(subCatItemJoinPath);


// menuFile.write('id,name\n');
// dishFile.write('id,name,description,price,business_id,subcat_id,cat_id\n');
// subCatItemJoinFile.write('id,subcat_id,item_id\n');


// let dishesInfo = '';
// let menuInfo = '';
// let subCatItemJoin = '';


// let dishIds = [];
// let dish = '';
// let menu = '';

// var secondsToReadableTime = (timeInSeconds) => {
//   var hours = 0;
//   var minutes = 0;
//   var seconds = timeInSeconds;
//   hours = Math.floor(seconds / 3600);
//   seconds -= hours * 3600;
//   minutes = Math.floor(seconds / 60);
//   seconds -= minutes * 60;
//   var result = '';
//   if (hours > 0) {
//     result += `${hours.toFixed(0)} hours, `;
//   }
//   if (minutes > 0) {
//     result += `${minutes.toFixed(0)} minutes, `;
//   }
//   if (seconds > 0) {
//     result += `${seconds.toFixed(2)} seconds`;
//   }
//   return result;
// }
// let arr = [];
// Object.keys(foodCategories).forEach((cat) => {
//   arr = arr.concat(foodCategories[cat]);
// })
// const totalSubCats = arr.length;
// const itemsPerSubCat = Math.floor(dishesPerMenu / totalSubCats);
// const itemsPerCat = mainCategories.map((cat) => {
//   return foodCategories[cat].length * itemsPerSubCat;
// });

// const write = (writer, data) => {
//   return new Promise((resolve) => {
//     if (!writer.write(data)) {
//       writer.once('drain', resolve)
//     }
//     else {
//       resolve()
//     }
//   })
// }

// const start = Date.now();
// let elapsed = 0;
// let projectedTime = 0;
// connectDB( async (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     const passes = numMenusTotal / numMenusPerWrite;
// //    for (let i = 1; i <= passes; i++) {
// //      createMenus();
// //      await write(menuFile, menuInfo);
// //      await write(dishFile, dishesInfo);
// //      await write(subCatItemJoinFile, subCatItemJoin);
// //      dishesInfo = '';
// //      menuInfo = '';
// //      subCatItemJoin = '';
// //
// //    }
//     elapsed = ((Date.now() - start) / 1000).toFixed(2);
//     console.log(`CSV files have been generated.`);
//     console.log(`Done, generated table info for ${menuCounter} menus and ${dishCounter} dishes in ${secondsToReadableTime(elapsed)}.`);
//     console.log(`onto seeding...`);
//     menuSeed(menuFilePath, (err) => {
//       if (err) {
//         console.log(err);
//         disconnectDB();
//       } else {
//         elapsed = ((Date.now() - start) / 1000).toFixed(2);
//         console.log(`1 - seeded menus table, elapsed time: ${secondsToReadableTime(elapsed)}`);
//         dishSeed(dishFilePath, (err) => {
//           if (err) {
//             console.log(err);
//             disconnectDB();
//           } else {
//             elapsed = ((Date.now() - start) / 1000).toFixed(2);
//             console.log(`2 - seeded dishes table, elapsed time: ${secondsToReadableTime(elapsed)}`);
//             itemSubCatJoinSeed(subCatItemJoinPath, (err) => {
//               if (err) {
//                 console.log(err);
//                 disconnectDB();
//               } else {
//                 console.log('3 - seeded subCatItemJoin table');
//                 elapsed = ((Date.now() - start) / 1000).toFixed(2);
//                 console.log(`Done, seeded ${menuCounter} menus and ${dishCounter} dishes in ${secondsToReadableTime(elapsed)}.`);
//                 disconnectDB();
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

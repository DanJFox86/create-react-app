const { Client } = require('pg');
const Promise = require('bluebird');
const fs = require('fs');
// const { createMenu, createDish, foodCategories, mainCategories, subCatMap, subCatArr } = require('./generateData.js');
const dbInfo = require('../postgres.login.js');

const client = new Client(dbInfo);

const createTablesQuery = `
DROP TABLE IF EXISTS data;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS dates;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS types;



CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE states (
  id SERIAl,
  name VARCHAR(50) NOT NULL,
  country_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE dates (
  id SERIAL PRIMARY KEY,
  text VARCHAR(50) NOT NULL
);

CREATE TABLE types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE data (
  id SERIAL PRIMARY KEY,
  value INT NOT NULL,
  type_id INT NOT NULL,
  country_id INT,
  state_id INT,
  date_id INT NOT NULL,
  FOREIGN KEY (country_id) REFERENCES COUNTRIES (id),
  FOREIGN KEY (type_id) REFERENCES types (id),
  FOREIGN KEY (state_id) REFERENCES STATES (id),
  FOREIGN KEY (date_id) REFERENCES DATES (id)
);
`;


/* CREATE TABLE subcategories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE categories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE menuItems (
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  price float(2)  NOT NULL,
  business_id INT NOT NULL,
  subcat_id INT NOT NULL,
  cat_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (business_id) REFERENCES menus(id),
  FOREIGN KEY (cat_id) REFERENCES categories(id),
  FOREIGN KEY (subcat_id) REFERENCES subcategories(id)
);

CREATE TABLE catSubcatJoin (
  id int NOT NULL,
  category_id int NOT NULL,
  subcat_id int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (subcat_id) REFERENCES subcategories(id)
);

CREATE TABLE subcatItemJoin (
  id int NOT NULL,
  subcat_id int NOT NULL,
  item_id int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (subcat_id) REFERENCES subcategories(id),
  FOREIGN KEY (item_id) REFERENCES menuitems(id)
  */

//client.connect()
//  .then(() => {
//    createTables();
//  })
//  .catch((err) => {
//    console.log(`Hit an error:       `, err)
//  });
module.exports.createTables = (callback) => {
  client.query(createTablesQuery, (err, result) => {
    if (err) {
      console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
      console.log(err);
    } else {
      console.log('success');
      callback();
    }
  });
}

module.exports.connectDB = (callback) => {
  client.connect(callback);
}

module.exports.runQuery = (query) => {
  console.log(`Running query ${query.slice(0, query.indexOf('VALUES'))}`)
  return new Promise((resolve, reject) => {
    client.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
}
module.exports.disconnectDB = (callback) => {
  client.end();
}

module.exports.dishSeed = (path, callback) => {
  client.query(`COPY menuItems FROM '${path}' CSV HEADER;`, callback);
}



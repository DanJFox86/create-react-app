const db = require('../database/postgresqlController.js');

const express = require('express');
const path = require('path');
const app = express();
const port = 4000;
const _ = require('underscore');

const bodyParser = require('body-parser');
const morgan = require('morgan');

// app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));
console.log(__dirname)

db.connectDB();

app.get('/initialize', (req, res) => {
  console.log(`sending initialization data`)
  db.initialize((err, data) => {
    if (err) {
      res.send({
        states: [],
        countries: []
      });
    } else {
      // console.log(data.rows);
      res.send(data);
    }
  });
});

app.get('/country/:country_id', (req, res) => {
  let data = {};
  let typesIds = [];
  let datesIds = []; 
  let { country_id } = req.params;
  db.runQuery(`select value, date_id, type_id from data INNER JOIN types on data.type_id = types.id INNER JOIN dates ON data.date_id = dates.id and data.country_id = ${country_id};`)
    .then((result) => {
      // console.log(result.rows);
      result.rows.forEach((row) => {
        if (!typesIds.includes(row.type_id)) {
          typesIds.push(row.type_id);
        }
        if (!datesIds.includes(row.date_id)) {
          datesIds.push(row.date_id);
        }
      });
      data.points = result.rows;
      let query = `SELECT * from dates where ${`id=` + datesIds.join(` OR id=`)};`;
      return db.runQuery(query);
    })
    .then((result) => {
      data.dates = result.rows;
      return db.runQuery(`SELECT * FROM types WHERE ${`id=` + typesIds.join(` OR id=`)};`);
    })
    .then((result) => {
      data.types = result.rows;
      // console.log(data);
      res.send(data);
    })
    .catch((e) => {
      res.send({
        dates: [],
        types: [],
        points: []
      });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
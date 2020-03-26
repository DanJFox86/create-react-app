const db = require('../database/postgresqlController.js');

const express = require('express');
const path = require('path');
const app = express();
const port = 4000;
const _ = require('underscore');

app.use(express.static(path.join(__dirname, 'build')));
console.log(__dirname)

app.get('/89', (req, res) => {
  db.connectDB((err) => {
    if (err) {
      db.disconnectDB();
    } else {
      let data = {};
      let typesIds = [];
      let datesIds = []; 
      db.runQuery(`select value, date_id, type_id from data INNER JOIN types on data.type_id = types.id INNER JOIN dates ON data.date_id = dates.id and data.country_id = 89 and data.state_id=21;`)
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
          console.log(data);
          res.send(data);
          db.disconnectDB();
        });


    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const db = require('./postgresqlController.js');

db.connectDB((err, result) => {
  if (err) {
    // console.log(err);
    db.disconnectDB();
  } else {
    console.log('successfully connected to server')
    db.createTables(() => {
      // console.log('created tables');
      db.disconnectDB();
    })
  }
});
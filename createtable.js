// mysql connection
var mysql = require('mysql')

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'mysqluser',
    password: 'password',
    database: 'node-sample',
    debug: true
  }, 'request')

conn.connect(function(error){
  if(error){
    throw error
  }
  console.log('connected to db')

  var ctable = 'CREATE TABLE IF NOT EXISTS users (ID int NOT NULL AUTO_INCREMENT PRIMARY KEY, firstName varchar(100) NOT NULL, lastName varchar(100) NOT NULL, streetAddress varchar(100) NOT NULL, city varchar(100) NOT NULL, state varchar(100) NOT NULL, zip varchar(100) NOT NULL)'
  conn.query(ctable, function(err,res){
      if (err) {
        console.log(err)
      }
      console.log('table created')
    })
  })
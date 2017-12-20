var mysql = require('mysql')

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'mysqluser',
    password: 'password',
    debug: true
  }, 'request')

conn.connect(function(error){
  if(error){
    throw error
  }
  console.log('connected to db')



  var createdb = 'CREATE DATABASE IF NOT EXISTS node-sample'
  conn.query(createdb, function(err,res){
      if (err) {
        console.log(err)
      }
      console.log('created db')
    })
  })
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var path     = require('path')

// 
app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

// mysql connection
var connection = require('express-myconnection')
  mysql = require('mysql')

app.use(connection(mysql, {
    host: 'localhost',
    user: 'mysqluser',
    password: 'password',
    database: 'rvtd',
    debug: true
  }, 'request')
)


app.get('/', function(req, res) {
  res.send('welcome')
})

// RESTful routes
var router = express.Router()
router.use(function(req, res, next) {
  console.log(req.method, req.url)
  next()
})
var usersroute = router.route('/users')

usersroute.get(function(req, res, next){
  req.getConnection(function(err,conn){
    if (err) return next('cannot connect')
      var query = conn.query('SELECT * FROM user', function(err,rows){
      if (err) {
        console.log(err)
        return next("mysql error, check your query")
      }
      res.render('users',{title:"",data:rows})
    })
  })
})
app.use('/', router)
app.listen(3000,function(){
  console.log('listening to port 3000')
})

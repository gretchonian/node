var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var path = require('path')
var expressValidator = require('express-validator')
// var jquery = require('jquery')

const { check, validationResult } = require('express-validator/check')


app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

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
      res.render('users',{data:rows})
    })
  })
})

usersroute.post(function(req, res, next){
  console.log(req.body)

    //validation
    req.check('firstName', 'First Name is required').notEmpty()
    req.check('lastName', 'Last Name is required').notEmpty()
    req.check('streetAddress', 'Street address is required').notEmpty()
    req.check('city', 'City is required').notEmpty()
    req.check('state', 'State is required').notEmpty()
    req.check('zip', 'Zip is required').notEmpty()
  
    var val_errors = req.validationErrors(true)
    if (val_errors) {
      res.status(422).json(val_errors)
    return
      
    } else {
      var data = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        streetAddress:req.body.streetAddress,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip
    }
    req.getConnection(function(err,conn){
      if (err) return next('cannot connect')
        var query = conn.query('INSERT INTO user set ?',data, function(err,rows){
        if (err) {
          console.log(err)
          return next("mysql error, check your query")
        }
        res.redirect('back')
      })
    })
  }
})
app.use('/', router)

app.listen(3000,function(){
  console.log('listening to port 3000')
})

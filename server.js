// use 'strict'
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var path = require('path')
var expressValidator = require('express-validator')
const { check, validationResult } = require('express-validator/check')

app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(expressValidator())

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
// var submituser = router.route('/submituser')

usersroute.get(function(req, res, next){
  req.getConnection(function(err,conn){
    if (err) return next('cannot connect')
      var query = conn.query('SELECT * FROM user', function(err,rows){
      if (err) {
        console.log(err)
        return next("mysql error, check your query")
      }
      res.render('users',{title:"why is there an error?",data:rows})
    })
  })
})

usersroute.post(function(req, res, next){
  console.log(req.body)

    //validation
    req.check('firstName', 'Name is required').notEmpty()
    // req.assert('firstName','Name is required').notEmpty();
    // req.assert('email','A valid email is required').isEmail();
    // req.assert('password','Enter a password 6 - 20').len(6,20);

    // var errors = req.validationErrors();
    // if(errors){
    //     res.status(422).json(errors);
    //     return;
    // }
    var errors = req.validationErrors();
  if (errors) {
    // res.send(errors);
    res.status(422).json(errors)
    return;
  } else {
    // normal processing here

    var data = {
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      // streetAddress:req.body.streetAddress,
      // city:req.body.city,
      // state:req.body.state,
      // zip:req.body.zip,
    }
    console.log(data)
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

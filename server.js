var express = require('express')
  , app = express()
  , server = app.listen(3000)
  , bodyParser = require('body-parser')
  , connection = require('express-myconnection')
  , mysql = require('mysql')
  , router = express.Router()
  , expressValidator = require('express-validator')

const { check, validationResult } = require('express-validator/check')

app.set('views', __dirname + '/views') //set directory to views folder (this is the default)
app.set('view engine', 'ejs')// set view engine
app.use(express.Router())
app.use(expressValidator())
app.use(function(req,res,next) {
  console.log(req.method,req.url)
  next()
})
app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.urlencoded({ extended: true})) //true ==> qs library
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(connection(mysql, {
  host: 'localhost',
  user: 'mysqluser',
  password: 'password',
  database: 'rvtd'
}, 'request' ))

var usersroute = router.route('/users')
//route to users plus data from mysql db
usersroute.get(function(req, res,next) {
  req.getConnection(function(err, conn){
    if (err)
      return next('.get cannot connect to mysql')
    var query = conn.query('SELECT * from users', function(err, rows) {
      if (err) {
        return next('mysql query error')
      }
      res.render('users', {data:rows})
    })
  })
})
usersroute.post(function(req, res, next) {
  //validation
  req.check('firstName', 'First Name is required').notEmpty()
  req.check('lastName', 'Last Name is required').notEmpty()
  req.check('streetAddress', 'Street address is required').notEmpty()
  req.check('city', 'City is required').notEmpty()
  req.check('state', 'State is required').notEmpty()
  req.check('zip', 'Zip is required').notEmpty()
  var val_errors = req.validationErrors(true)
  if (val_errors) {
    console.log(val_errors)
    res.status(422).json(val_errors)
  } else {
  //prepare output in json format
  var data = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    streetAddress:req.body.streetAddress,
    city:req.body.city,
    state:req.body.state,
    zip:req.body.zip
  }
  req.getConnection(function(err, conn){
    if (err) return next('cannot connect to mysql')
    var query = conn.query('INSERT INTO users set ?',data, function(err, rows) {
      if (err) {
        // console.log(err)
        return next(err)
      }
      res.redirect('back')
    })
  })
}
})

// app.get('/main', function(req, res) {
//   res.render('main')
// })

app.get('/', function(req, res,) {
  res.send('welcome')   
})
app.use('/',router)

console.log('express server listening on port 3000')
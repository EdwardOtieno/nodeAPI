const express = require('express')
const logger = require ('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')

const app = express()

const routes = {
    singup: require('./server/services/user/index')
}
//models
const models = require('./server/models')
require('./server/config/passport')(passport,models.user);

//BodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//logger
app.use(logger('dev'))


//passport
app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    })); // session secret
app.use(passport.initialize());
app.use(passport.session())



app.get('/', (req, res) => res.status(200).send({
    status: "success",
}));

var data;
app.post('/data', (req, res) => {
    data = req.body;
    res.json(data);
})

app.get('/data', (req, res) => {
    res.send(data);
})

// signup route
app.use('/user/', routes.singup);
module.exports = app
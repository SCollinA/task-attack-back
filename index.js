const db = require('./models/db')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const store = new (require('connect-pg-simple')(session))({ pgPromise: db })
const app = express()
const port = 7000

app.use(session({
    store,
    secret: 'sUpErS3cR3t',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 } // 1 days
}));

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.listen(port, () => console.log(`task-attack-back listening on port ${port}`)) 
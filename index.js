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

// CREATE
// register | add user
app.post('signup', (req, res) => {
    res.send('you trying to sign up, chief?')
})
// add task
app.post('addTask', (req, res) => {
    res.send('you tryina add a task, chief?')
})
// RETRIEVE
// login | get user
app.post('login', (req, res) => {
    res.send('you trying to log in, chief?')
})
// UPDATE
app.post('updateUser', (req, res) => {
    res.send('you trying to update yourself, chief?')
})
app.post('updateTask', (req, res) => {
    res.send('you trying to update a task, chief?')
})
// DELETE
app.delete('deleteTask', (req, res) => {
    res.send('you trying to delete a task, chief?')
})


app.listen(port, () => console.log(`task-attack-back listening on port ${port}`)) 
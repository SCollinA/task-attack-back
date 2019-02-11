const db = require('./models/db')
const User = require('./models/User')
const Task = require('./models/Task')

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

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('hey mane')
})

// custom middleware
// check if user is logged in
function checkUser(req, res, next) {
    console.log('checking user')
    console.log(req.session.user)
    if (req.session.user.id) {
        next()
    } else {
        res.send('you gotta login, chief')
    }
}

function checkTask(req, res, next) {
    const { taskId } = req.params
    Task.getById(taskId)
    .then(task => {
        if (task.user_id === req.session.user.id) { 
            next()
        } else {
            res.send('is that your task, chief?')
        }
    })
}

// CREATE
// register | add user
app.post('/signup', (req, res) => {
    console.log('you trying to sign up, chief?')
    const { name, password } = req.body
    User.add(name, password)
    .then(user => {
        // set user to be logged in
        req.session.user = user
        res.send(user)
        console.log('thanks for signing up, chief')
    })
    .catch(err => {
        res.send('something went wrong signing up, chief')
        console.log(err)
    })
})
// add task
app.post('/addTask', checkUser, (req, res) => {
    console.log('you tryna add a task, chief?')
    const { name, timeStart, timeEnd, mandatory, active } = req.body
    const userId = req.session.user.id
    Task.add(userId, name, timeStart, timeEnd, mandatory, active)
    .then(task => res.send(task))
})
// RETRIEVE
// login | get user
app.post('/login', (req, res) => {
    console.log('you trying to log in, chief?')
    const { name, password } = req.body
    User.getByName(name)
    .then(user => {
        if (user.matchPassword(password)) {
            req.session.user = user
            res.send('gotcha logged in, chief')
        } else {
            res.send('bad password, chief')
        }
    })
    .catch(err => {
        console.log(err)
        res.send('bad username, chief')
    })
})
// UPDATE
app.post('/updateUser', checkUser, (req, res) => {
    console.log('you trying to update yourself, chief?')
    console.log(req.body)
    const { name, password } = req.body
    User.getById(req.session.user.id)
    .then(user => {
        return Promise.all([
            name && user.updateName(name),
            password && user.updatePassword(password)
        ])
    })
    // receive at least one copy of updated user
    .then(users => res.send(users.pop()))
    .catch(err => console.log('not seeing the task, chief', err))
})
app.post('/updateTask/:taskId(\\d+)', checkUser, checkTask, (req, res) => {
    console.log('you trying to update a task, chief?')
    const { taskId } = req.params
    const { name, timeStart, timeEnd, mandatory, active } = req.body
    Task.getById(taskId)
    .then(task => {
        return Promise.all([
            name && task.updateName(name),
            timeStart && task.updateTimeStart(timeStart),
            timeEnd && task.updateTimeEnd(timeEnd),
            mandatory && task.updateMandatory(mandatory),
            active && task.updateActive(active)
        ])
    })
    // receive at least one copy of updated task
    .then(tasks => res.send(tasks.pop()))
    .catch(err => console.log('not seeing the task, chief', err))
})
// DELETE
app.delete('/deleteTask', checkUser, (req, res) => {
    console.log('you trying to delete a task, chief?')
    const { taskId } = req.body
    Task.getById(taskId)
    .then(task => task.delete())
    .then(() => {
        res.send('task deleted, chief')
        console.log('task deleted, chief')
    })
})
app.post('/logout', (req, res) => {
    console.log('you tryna logout, chief?')
    req.session.user = null
    res.send('all logged out, chief')
})

app.listen(port, () => console.log(`task-attack-back listening on port ${port}`)) 
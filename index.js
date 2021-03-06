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

app.get('/attack', (req, res) => {
    const sessionUser = req.session.user
    if (sessionUser) {
        User.getById(sessionUser.id)
        .then(user => {
            Task.getByUserId(user.id)
            .then(tasks => {
                res.send({user, tasks})
            })
        })
    } else {
        res.status(401)
        res.send({errorMessage: 'no one logged in, chief'})
    }
})

// custom middleware
// check if user is logged in
function checkUser(req, res, next) {
    console.log('checkin ya, chief', req.session.user)
    if (req.session.user.id) {
        next()
    } else {
        res.send({errorMessage: 'you gotta login, chief'})
    }
}

function checkTask(req, res, next) {
    console.log('checking task')
    const { taskId } = req.params
    Task.getById(taskId)
    .then(task => {
        if (task.user_id === req.session.user.id) { 
            next()
        } else {
            res.send({errorMessage: 'is that your task, chief?'})
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
        res.send({errorMessage: 'something went wrong signing up, chief'})
        console.log('something went wrong signing up, chief', err)
    })
})
// add task
app.post('/addTask', checkUser, (req, res) => {
    console.log('you tryna add a task, chief?')
    const { name, start, end, mandatory, active } = req.body
    const userId = req.session.user.id
    // add the task
    Task.add(userId, name, start.hour, start.minute, end.hour, end.minute, mandatory, active)
    .then(newTask => {
        console.log(newTask)
        // send all the tasks back
        Task.getByUserId(userId)
        .then(tasks => res.send({tasks, newTask}))
    })
    .catch(err => {
        console.log(err)
        res.send({errorMessage: 'something went wrong adding the task, chief'})
    })
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
            // send user and tasks
            Task.getByUserId(user.id)
            .then(tasks => res.send({ user, tasks }))
            .then(() => console.log('gotcha logged in, chief'))
        } else {
            res.send({errorMessage: 'bad password, chief'})
        }
    })
    .catch(err => {
        console.log('bad username, chief', err)
        res.send({errorMessage: 'bad username, chief'})
    })
})
// UPDATE
app.post('/updateUser', checkUser, (req, res) => {
    console.log('you trying to update yourself, chief?')
    const { newName, newPassword, oldPassword } = req.body
    User.getById(req.session.user.id)
    .then(user => {
        console.log(user)
        if (user.matchPassword(oldPassword)) {
            return Promise.all([
                newName && user.updateName(newName),
                newPassword !== '' && user.updatePassword(newPassword)
            ])
        } else { 
            res.status(401)
            res.send(user)
            throw new Error('bad password, chief')
        }
    })
    .then(() => {
        User.getById(req.session.user.id)
        .then(updatedUser => res.send(updatedUser))
    })
    .catch(err => {
        console.log('not seeing the user, chief', err)
        res.send({errorMessage: 'not seeing the user, chief'})
    })
})
app.post('/updateTask/:taskId(\\d+)', checkUser, checkTask, (req, res) => {
    console.log('you trying to update a task, chief?')
    const { taskId } = req.params
    const { name, start, end, mandatory, active } = req.body
    Task.getById(taskId)
    .then(task => {
        console.log(task)
        return Promise.all([
            task.updateName(name),
            task.updateTimeStart(start.hour, start.minute),
            task.updateTimeEnd(end.hour, end.minute),
            task.updateMandatory(mandatory),
            task.updateActive(active)
        ])
    })
    // receive at least one copy of updated task
    .then(() => {
        Task.getByUserId(req.session.user.id)
        .then(tasks => res.send(tasks))
    })
    .catch(err => {
        console.log('not seeing the task, chief', err)
        res.send({errorMessage: 'not seeing the task, chief'})
    })
})
// DELETE
app.delete('/deleteTask/:taskId(\\d+)', checkUser, checkTask, (req, res) => {
    console.log('you trying to delete a task, chief?')
    const { taskId } = req.params
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
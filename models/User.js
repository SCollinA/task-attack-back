const db = require('./db')
const bcrypt = require('bcrypt')
const saltRounds = 10

class User {
    constructor(id, name, pwhash) {
        this.id = id
        this.name = name
        this.pwhash = pwhash
    }

    // CREATE
    static add(name, password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const pwhash = bcrypt.hashSync(password, salt)
        return db.one('insert into users (name, pwhash) values ($1, $2) returning id, name, pwhash', [name, pwhash])
        .then(makeOneUser)
    }

    matchPassword(password) {
        return bcrypt.compareSync(password, this.pwhash)
    }
    // RETRIEVE
    // get by id
    static getById(id) {
        return db.one('select * from users where id=$1:raw', [id])
        .then(makeOneUser)
    }
    // get by name
    static getByName(name) {
        return db.one('select * from users where name=\'$1:raw\'', [name])
        .then(makeOneUser)
    }
    static getAll() {
        return db.any('select * from users')
        .then(makeManyUsers)
    }
    // UPDATE
    updateName(newName) {
        return db.result('update users set name=$1 where id=$2 returning id, name, pwhash', [newName, this.id])
        .then(makeOneUser)
    }
    updatePassword(newPassword) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const pwhash = bcrypt.hashSync(newPassword, salt)
        return db.one('update users set pwhash=$1 where id=$2 returning id, name, pwhash', [pwhash, this.id])
        .then(makeOneUser)
    }
    // DELETE
    delete() {
        return db.result('delete from users where id=$1:raw', [this.id])
    }
}

// hydrate a User object with data from db
function makeOneUser({ id, name, pwhash }) {
    return new User(id, name, pwhash)
}
// map array of db results to user objects
function makeManyUsers(results) {
    return results.map(makeOneUser)
}

module.exports = User
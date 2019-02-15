const db = require('./db')

class Task {
    constructor(id, user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active) {
        this.id = id
        this.user_id = user_id
        this.name = name
        this.start_hour = start_hour
        this.start_min = start_min
        this.end_hour = end_hour
        this.end_min = end_min
        this.mandatory = mandatory
        this.active = active
    }

    // CREATE
    static add(user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active) {
        return db.one(`
        insert into tasks 
        (user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active) 
        values 
        ($1, $2, $3, $4, $5, $6, $7, $8)
        returning
        id, user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active
        `, [user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active])
        .then(makeOneTask)
    }
    // RETRIEVE
    static getById(id) {
        return db.one('select * from tasks where id=$1', [id])
        .then(makeOneTask)
    }
    static getByUserId(user_id) {
        return db.any('select * from tasks where user_id=$1 order by start_hour, start_min desc', [user_id])
        .then(makeManyTasks)
    }
    // UPDATE
    updateName(newName) {
        return db.result(`update tasks set name=$1 where id=$2`, [newName, this.id])
        .then(() => Task.getById(this.id))
    }
    updateTimeStart({start_hour, start_min}) {
        return db.result(`update tasks set start_hour=$1, start_min=$2 where id=$3`, [start_hour, start_min, this.id])
        .then(() => Task.getById(this.id))
    }
    updateTimeEnd({end_hour, end_min}) {
        return db.result(`update tasks set end_hour=$1, end_min=$2 where id=$3`, [end_hour, end_min, this.id])
        .then(() => Task.getById(this.id))
    }
    updateMandatory(newMandatory) {
        return db.result(`update tasks set mandatory=$1 where id=$2`, [newMandatory, this.id])
        .then(() => Task.getById(this.id))
    }
    updateActive(newActive) {
        return db.result(`update tasks set active=$1 where id=$2`, [newActive, this.id])
        .then(() => Task.getById(this.id))
    }
    // DELETE
    delete() {
        return db.result(`delete from tasks where id=$1`, [this.id])
    }
}

function makeOneTask({ id, user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active }) {
    return new Task(id, user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active)
}
function makeManyTasks(results) {
    return results.map(makeOneTask)
}

module.exports = Task
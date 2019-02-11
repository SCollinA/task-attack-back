const db = require('./db')

class Task {
    constructor(id, user_id, name, time_start, time_end, mandatory, active) {
        this.id = id
        this.user_id = user_id
        this.name = name
        this.time_start = time_start
        this.time_end = time_end
        this.mandatory = mandatory
        this.active = active
    }

    // CREATE
    static add(user_id, name, time_start, time_end, mandatory, active) {
        return db.one(`
        insert into tasks 
        (user_id, name, time_start, time_end, mandatory, active) 
        values 
        ($1, $2, $3, $4, $5, $6)
        returning
        id, user_id, name, time_start, time_end, mandatory, active
        `, [user_id, name, time_start, time_end, mandatory, active])
        .then(makeOneTask)
    }
    // RETRIEVE
    static getById(id) {
        return db.one('select * from tasks where id=$1', [id])
        .then(makeOneTask)
    }
    static getByUserId(user_id) {
        return db.any('select * from tasks where user_id=$1', [id])
        .then(makeManyTasks)
    }
    // UPDATE
    updateName(newName) {
        return db.result(`update tasks set name=$1 where id=$2`, [newName, this.id])
        .then(() => Task.getById(this.id))
    }
    updateTimeStart(newTimeStart) {
        return db.result(`update tasks set time_start=$1 where id=$2`, [newTimeStart, this.id])
        .then(() => Task.getById(this.id))
    }
    updateTimeEnd(newTimeEnd) {
        return db.result(`update tasks set time_end=$1 where id=$2`, [newTimeEnd, this.id])
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

function makeOneTask({ id, user_id, name, time_start, time_end, mandatory, active }) {
    return new Task(id, user_id, name, time_start, time_end, mandatory, active)
}
function makeManyTasks(results) {
    return results.map(makeOneTask)
}

module.exports = Task
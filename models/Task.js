const db = require('./db')

export default class Task {
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
        return db.result(`update tasks set name=$1 returning id`, [newName])
        .then(getById)
    }
    updateTimeStart(newTimeStart) {
        return db.result(`update tasks set time_start=$1 returning id`, [newTimeStart])
        .then(getById)
    }
    updateTimeEnd(newTimeEnd) {
        return db.result(`update tasks set time_end=$1 returning id`, [newTimeEnd])
        .then(getById)
    }
    updateMandatory(newMandatory) {
        return db.result(`update tasks set mandatory=$1 returning id`, [newMandatory])
        .then(getById)
    }
    updateActive(newActive) {
        return db.result(`update tasks set active=$1 returning id`, [newActive])
        .then(getById)
    }
    // DELETE
    delete() {
        return db.result(`delete from tasks where id=$1`, [this.id])
    }

    makeOneTask({ id, user_id, name, time_start, time_end, mandatory, active }) {
        return new Task(id, user_id, name, time_start, time_end, mandatory, active)
    }
    makeManyTasks(results) {
        return results.map(makeOneTask)
    }
}
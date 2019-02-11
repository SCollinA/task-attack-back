create table users (
    id serial primary key,
    name varchar(60) unique not null,
    pwhash varchar(60) not null
);

create table tasks (
    id serial primary key,
    user_id integer references users (id) on delete cascade,
    name text,
    time_start time,
    time_end time,
    mandatory boolean,
    active boolean
);
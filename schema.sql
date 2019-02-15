create table users (
    id serial primary key,
    name varchar(60) unique not null,
    pwhash varchar(60) not null
);

create table tasks (
    id serial primary key,
    user_id integer references users (id) on delete cascade,
    name text,
    start_hour integer,
    start_min integer,
    end_hour integer,
    end_min integer,
    mandatory boolean,
    active boolean
);
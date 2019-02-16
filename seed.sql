insert into users
(name, pwhash)
values
('collin', '$2b$10$fSgsCMP09txXoeKRY2qAbO3XbEv/rcvbhmZ88N1LTrnwqyETxj.Pq');

insert into tasks 
(user_id, name, start_hour, start_min, end_hour, end_min, mandatory, active)
values
(1, 'breakfast', 5, 0, 5, 59, true, false),
(1, 'second breakfast', 8, 0, 8, 59, true, false),
(1, 'lunch', 10, 0, 10, 59, true, false),
(1, 'second lunch', 14, 0, 14, 59, true, false),
(1, 'dinner', 18, 0, 18, 59, true, false);
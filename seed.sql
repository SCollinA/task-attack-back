insert into users
(name, pwhash)
values
('collin', '$2b$10$fSgsCMP09txXoeKRY2qAbO3XbEv/rcvbhmZ88N1LTrnwqyETxj.Pq');

insert into tasks 
(user_id, name, time_start, time_end, mandatory, active)
values
(1, 'breakfast', '5:00', '6:00', true, false);
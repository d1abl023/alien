CREATE TABLE user_info(id bigint, login text, date_of_birth date, sex text, phone_number bigint, country text, city text, status text, type text,PRIMARY KEY(id));
CREATE TABLE auth_data(id bigint, login text, password text, phone_number bigint, email text,PRIMARY KEY(id));
CREATE TABLE chat_room_1_messages(id bigint, type text, content text, sender text, timestamp text, PRIMARY KEY(id));
CREATE TABLE users(id bigint, login text, email text, date_of_birth date, sex text, phone_number bigint, country text, city text, place_of_work text, education text, status text, type text,PRIMARY KEY(id));
CREATE TABLE dialogs (id SERIAL NOT NULL, user1 bigint, user2 bigint, user1Login text, user2Login text, PRIMARY KEY(id));
CREATE TABLE messages (id SERIAL NOT NULL, dialogId bigint, sender text, msg text, receiver text, timestamp bigint, PRIMARY KEY(id));
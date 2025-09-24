DROP TABLE IF EXISTS user_info CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    email VARCHAR(50),
    user_password VARCHAR(50)
);

CREATE TABLE user_info(
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(150),
    address VARCHAR(200),
    birthday DATE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_info_user_id ON user_info(user_id);
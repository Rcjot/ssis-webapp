DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;

CREATE TABLE colleges(
    code VARCHAR(15) PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE programs (
    code VARCHAR(15) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    college_code VARCHAR(15) NULL,
    FOREIGN KEY (college_code) REFERENCES colleges(code)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE students (
    id VARCHAR(9) PRIMARY KEY CHECK (id ~ '^[0-9]{4}-[0-9]{4}$'),
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    gender CHAR(1) NOT NULL,
    year_level SMALLINT NOT NULL CHECK (year_level BETWEEN 1 AND 5),
    program_code VARCHAR(15) NULL,
    student_pfp_url TEXT NULL,
    FOREIGN KEY (program_code) REFERENCES programs(code)
    ON DELETE SET NULL
    ON UPDATE CASCADE
)

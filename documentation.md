<h1>Documentation</h1>

<h2>Create table statements:</h2>

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(320) NOT NULL,
	password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

Create TABLE morning_report (
	id SERIAL PRIMARY KEY,
	date DATE,
	sleep_duration FLOAT NOT NULL,
	sleep_quality INTEGER NOT NULL,
	mood INTEGER NOT NULL,
  	user_id INTEGER REFERENCES users(id)
);

Create TABLE evening_report (
	id SERIAL PRIMARY KEY,
	date DATE,
	sport_duration FLOAT NOT NULL,
	study_duration FLOAT NOT NULL,
	eating INTEGER NOT NULL,
	mood INTEGER NOT NULL,
	user_id INTEGER REFERENCES users(id)
);

<h2>address at which the application can currently be accessed:</h2>

https://self-monitoring-wsd.herokuapp.com/

<h2>guidelines for running the application locally:</h2>
<div>
$Env:PGHOST=""
$Env:PGDATABASE=""
$Env:PGUSER=""
$Env:PGPASSWORD=""
$Env:PGPORT=
</div>
insert variables from database credentials into commands abowe, run each command one by one

<h2>to run locally use following command:</h2>

deno run --unstable --allow-all app.js

<h2>to run tests use following command:</h2>

deno test --unstable --allow-all

(i only came up with 8 working tests)
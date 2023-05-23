import sq3 from 'sqlite3';

const sqlite3 = sq3.verbose();

const db = new sqlite3.Database('laika-db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE if not exists missions (
        id INTEGER PRIMARY KEY,
        name varchar(255),
        status varchar(9) CHECK (status IN ('active', 'inactive', 'failed')),
        startDate datetime,
        endDate datetime NULL,
        mode varchar(11) CHECK (mode IN ('simulation', 'live'))
    )`, (err) => {
        if (err) console.error("CREATE TABLE error", err);
    });

    db.run(`CREATE TABLE if not exists metrics (
        id INTEGER PRIMARY KEY,
        timestamp INTEGER,
        valid BOOLEAN,
        packet TEXT,
        mission INTEGER,
        FOREIGN KEY(mission) REFERENCES missions(id)
    )`, (err) => {
        if (err) console.error("CREATE TABLE error", err);
    });
});

export default db;
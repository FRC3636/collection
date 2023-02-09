const db = require('better-sqlite3')('roster.db');
const { TemplateTag } = require('common-tags');
const sql = new TemplateTag();

db.exec(sql`

CREATE TABLE IF NOT EXISTS wait_table(
    username TEXT PRIMARY KEY NOT NULL

);
CREATE TABLE IF NOT EXISTS main_table(
    username TEXT PRIMARY KEY NOT NULL,
    value TEXT
);
CREATE TABLE IF NOT EXISTS counter_table(
    roster TEXT PRIMARY KEY NOT NULL,
    items INTEGER
);

INSERT INTO counter_table(roster, items) VALUES('wait', 0);
INSERT INTO counter_table(roster, items) VALUES('main', 0);

`);

module.exports = db;
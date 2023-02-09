import Database from 'better-sqlite3';
import { TemplateTag } from 'common-tags';
const sql = new TemplateTag();

const db = new Database('collection.db');

db.exec(
    sql`
      DROP TABLE IF EXISTS wait_table;
      DROP TABLE IF EXISTS main_table;
      DROP TABLE IF EXISTS counter_table;

      CREATE TABLE IF NOT EXISTS wait_table(
          username TEXT PRIMARY KEY NOT NULL
      );
      CREATE TABLE IF NOT EXISTS main_table(
          username TEXT PRIMARY KEY NOT NULL,
          value TEXT
      );

      CREATE TABLE IF NOT EXISTS counter_table(
          the_collection TEXT PRIMARY KEY NOT NULL,
          items INTEGER
      );

      INSERT INTO counter_table(the_collection, items) VALUES('wait', 0);
      INSERT INTO counter_table(the_collection, items) VALUES('main', 0);
    `);

export default db;
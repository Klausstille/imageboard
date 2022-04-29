const spicedPg = require("spiced-pg");
// const { DB_USERNAME, DB_PASSWORD, DB_NAME } = require("../secrets.json");
// const db = spicedPg("postgres:postgres:postgres@localhost:5432/images");

let DB_USERNAME, DB_PASSWORD, DB_NAME;
// if (process.env.NODE_ENV !== "production") {
DB_USERNAME = require("../secrets.json").DB_USERNAME;
DB_PASSWORD = require("../secrets.json").DB_PASSWORD;
DB_NAME = require("../secrets.json").DB_NAME;
// }

var dbUrl =
    // process.env.DATABASE_URL ||
    `postgres:${DB_USERNAME}:${DB_PASSWORD}:@localhost:5432/${DB_NAME}`;

const db = spicedPg(dbUrl);

function getAllData() {
    return db.query("SELECT * FROM images ORDER BY id DESC");
}

module.exports = { getAllData };

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

function insertImage(url, username, title, description) {
    const query = `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
    const params = [url, username, title, description];
    return db.query(query, params).then((result) => result.rows[0]);
}

module.exports = { getAllData, insertImage };

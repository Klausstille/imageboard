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
    return db.query("SELECT * FROM images ORDER BY id DESC LIMIT 8");
}

function insertImage(url, username, title, description) {
    const query = `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
    const params = [url, username, title, description];
    return db.query(query, params).then((result) => result.rows[0]);
}

function getImageById(id) {
    return db
        .query(
            `SELECT * , 
            (SELECT id FROM images WHERE id<$1 ORDER BY id DESC LIMIT 1) AS "next",
            (SELECT id FROM images WHERE id>$1 ORDER BY id ASC LIMIT 1) AS "previous"
            FROM images
            WHERE id = $1`,
            [id]
        )
        .then((result) => result.rows[0]);
}

function getCommentsById(id) {
    console.log("getCommentsById");
    return db
        .query("SELECT * FROM comments WHERE image_id = $1", [id])
        .then((result) => result.rows);
}

function createComment(text, username, image_id) {
    const query = `INSERT INTO comments ( text, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
    const params = [text, username, image_id];
    return db.query(query, params).then((result) => result.rows[0]);
}

function getMoreImages(lastId) {
    const query = `        
        SELECT url, title, id, description, username, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 8;`;
    const params = [lastId];
    return db.query(query, params).then((result) => {
        return result.rows;
    });
}

module.exports = {
    getMoreImages,
    createComment,
    getCommentsById,
    getImageById,
    getAllData,
    insertImage,
};

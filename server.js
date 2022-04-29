const express = require("express");
const app = express();
const db = require("./sql/db");
const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
            callback(null, `${randomId}${path.extname(file.originalname)}`);
        });
        callback(null, "koala");
    },
});

const uploader = multer({
    storage,
    // storage: storage (same as above)
    // dest: "uploads",
});

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/image", uploader.single("image"), (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    if (req.file) {
        req.json({ success: true });
    }
});

app.get("/getimages", (req, res) => {
    db.getAllData().then((result) => {
        res.json(result.rows);
        console.log(result.rows);
    });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));

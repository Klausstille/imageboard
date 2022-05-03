const express = require("express");
const app = express();
const db = require("./sql/db");
const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");
const { upload } = require("./s3");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
            const fileName = `${randomId}${path.extname(file.originalname)}`;
            callback(null, fileName);
        });
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

app.post("/image", uploader.single("image"), upload, (req, res) => {
    console.log("*****************");
    console.log("POST /upload.json Route");
    console.log("*****************");
    console.log("file:", req.file);
    console.log("input:", req.body);

    const { username, title, description } = req.body;
    const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
    // console.log("DOES THIS GIVE ME THE CORRECT URL??", url);

    if (req.file) {
        db.insertImage(url, username, title, description).then(
            res.json({
                url: url,
                username: username,
                title: title,
                description: description,
            })
        );
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    console.log("/SERVER!!!comments:id, username, comments", id);

    db.getCommentsById(id)
        .then((comments) => {
            res.json(comments);
            console.log("/comments:id", comments);
        })
        .catch((error) => {
            console.log("error from SERVER SIDE while DB query", error);
        });
});

app.post("/comment", (req, res) => {
    const { text, username, image_id } = req.body;
    console.log("/comment", req.body);
    db.createComment(text, username, image_id)
        .then((comment) => {
            res.json(comment);
        })
        .catch((error) => {
            console.log("error in SERVER while DB insertion", error);
        });
});

app.get("/image/:id", (req, res) => {
    const { id } = req.params;
    db.getImageById(id).then((image) => {
        // console.log("/image:id", image);
        res.json(image);
    });
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

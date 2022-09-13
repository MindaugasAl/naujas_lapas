import express from "express";
import multer from "multer";
import path from "path";
import mysql from 'mysql2/promise'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'spotify',
  password: ''
});
// vienas
const port = process.env.PORT || 3000


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./nuotraukos");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".");

    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      ext[ext.length - 1];
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, next) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
});

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/nuotraukos", express.static("nuotraukos"));

app.post("/", upload.single("nuotrauka"), (req, res) => {
  res.send(req.file.filename);
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./templates/index.html"));
});

app.listen(port);

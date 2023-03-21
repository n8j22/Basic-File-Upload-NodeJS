const express = require("express");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static("public"));

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}));

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No file uploaded");
    return;
  }
  const pdfFile = req.files["pdf-file"];
  const sql = "INSERT INTO pdf_files (filename, mimetype, size, data) VALUES (?, ?, ?, ?)";
  const values = [pdfFile.name, pdfFile.mimetype, pdfFile.size, pdfFile.data];
  connection.query(sql, values, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("An error occurred while uploading the PDF file");
    } else {
      res.send("PDF file uploaded successfully");
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});




// CREATE TABLE pdf_files (
//   id INT(11) NOT NULL AUTO_INCREMENT,
//   filename VARCHAR(255) NOT NULL,
//   mimetype VARCHAR(255) NOT NULL,
//   size INT NOT NULL,
//   data LONGBLOB NOT NULL,
//   PRIMARY KEY (id)
// );
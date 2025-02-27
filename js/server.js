const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const multer  = require('multer');
const database = require("./database");
database.createTable();
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage}).single('file');
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));


app.post("/visits/add", (req, res) => {
    upload(req, res, (err) => {
        console.log('file caricato:', req.file.filename);
        database.insert({url: "./files/" + req.file.filename});
        res.json({url: "./files/" + req.file.filename});
    });
});

app.get('/visits', async (req, res) => {
    const list = await database.select();
    res.json(list);
});
app.delete("/delete/:id", async (req, res) => {
    await database.delete(req.params.id);
    res.json({result: "Ok"});  
});



 const server = http.createServer(app);
 server.listen(80, () => console.log(`Server in esecuzione su http://localhost:80`));
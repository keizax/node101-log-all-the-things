const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here
    var agent = req.headers['user-agent'];
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.url;
    var version = 'HTTP/' + req.httpVersion;
    var status = "200";
    var logData = `${agent},${time},${method},${resource},${version},${status}\n`;

    fs.appendFile('./log.csv', logData, err => {
        if (err) {
            throw err;
        } next();
    });
    console.log(logData);
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send("OK")
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile("log.csv", "utf8", (err, data) => {
        if (err) {
            throw err;
        };
        var jsonLog = [];
        var output = data.split('\n');
        output.shift();
        output.pop();

        output.forEach(line => {
            var objects = line.split(',');
            var jsonData = {
                'Agent': objects[0],
                'Time': objects[1],
                'Method': objects[2],
                'Resource': objects[3],
                'Version': objects[4],
                'Status': objects[5],
            };
            if (objects[0] !== "") {
                jsonLog.push(jsonData);
            };
        });
       res.json(jsonLog);
    });
});

module.exports = app;


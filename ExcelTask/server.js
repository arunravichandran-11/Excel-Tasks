const express = require('express');
var app = express();
const router = require("./routes");

app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(2222, () => console.log('server started'));
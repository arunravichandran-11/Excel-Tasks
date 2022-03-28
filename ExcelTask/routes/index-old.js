const express = require("express");
const router = express.Router();
const multer = require('multer');
const excel = require('exceljs');
const readXlsxFile = require("read-excel-file/node");
const uploadMiddleWare = require('./upload');
const dataFromDb = require('./data');
const largeData = require('./large_5000');
const queryString = require('query-string');
const config = require('../config');

// main logic to download;
const downloadController = (req, res) => {

    // create excel workbook - whole excel file....

    let workbook = new excel.Workbook();

    // create 1 or 2 sheets in excel workbook - sheet1, sheet2

    let worksheet = workbook.addWorksheet('Sheet1');
    let worksheet2 = workbook.addWorksheet('claims');

    // create columns in a sheet
    worksheet.columns = [
        { header: 'Id', key: 'id', width: 5 },
        { header: "Title", key: "title", width: 25 },
        { header: "Description", key: "description", width: 25 },
        { header: "amount", key: "amount", width: 10 },
    ];

    let claims = [...largeData];

    // creat n number of rows
    worksheet.addRows(claims);

    // response is a file, stream object , so set stream object header
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tutorials.xlsx"
    );

    // res.send({data: 'arun'});

    workbook.xlsx.write(res).then(() => {
        res.send(200).end();
    });

};

router.get('/api/download', downloadController);

router.get('/api/parseExcel', (req, res) => {

    let path =
        __dirname + "/sheet/10-sheet.xlsx";

    readXlsxFile(path).then((rows) => {
        // skip header
        rows.shift();
        let tutorials = [];
        console.table(rows);
        rows.forEach((row) => {
            let tutorial = {
                id: row[0],
                title: row[1],
                description: row[2],
                published: row[3],
            };

            tutorials.push(tutorial);
        });

        res.send({
            status: 200,
            data: tutorials
        });
    });
});

router.post('/api/upload', uploadMiddleWare.single('file'), (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }

        let path =
            __dirname + "/resources/static/" + req.file.filename;

        // res.send({
        //     data: 'file received ! processing data'
        // });

        readXlsxFile(path).then((rows) => {
            // skip header
            rows.shift();
            let tutorials = [];
            rows.forEach((row) => {
                let tutorial = {
                    id: row[0],
                    title: row[1],
                    description: row[2],
                    published: row[3],
                };

                tutorials.push(tutorial);
            });

            res.send({
                status: 200,
                data: tutorials
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
});


router.get('/authenticate/facebook', (req, res) => {
    console.log('req', req, res)
});

function fbLogin() {
    const stringifiedParams = queryString.stringify({
        client_id: config.APP_ID,
        redirect_uri: 'https://localhost:2222/authenticate/facebook/',
        scope: ['email', 'user_friends'].join(','), // comma seperated string
        response_type: 'code',
        auth_type: 'rerequest',
        display: 'popup',
    });

    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
    return facebookLoginUrl;
}

router.get('/auth', (req, res) => {
    let url = fbLogin();
    res.redirect(url);
});

module.exports = router;
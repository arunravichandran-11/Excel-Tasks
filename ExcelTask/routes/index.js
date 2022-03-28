const readXlsxFile = require('read-excel-file/node');
const XlsxPopulate = require('xlsx-populate');
const express = require('express');
const router = express.Router();
const fs = require('fs');
let path = __dirname + "/sheet/10-sheet.xlsx";

const schema = {
    'First Name': {
        // JSON object property name.
        prop: 'FName',
        type: String
    },
    'Last Name': {
        prop: 'LName',
        type: String
    },
    'Gender': {
        prop: 'Gender',
        type: String
    },
    'Country': {
        prop: 'Country',
        type: String
    },
    'OTHERS': {
        // Nested object path: `row.course`
        prop: 'others',
        // Nested object schema:
        type: {
            'Age': {
                prop: 'age',
                type: Number
            },
            'Date': {
                prop: 'date',
                type: String
            },
            'Id': {
                prop: 'id',
                type: Number
            }
        }
    },

};


router.get('/api/parseExcel', (req, res) => {

    console.log('schema', schema);
    readXlsxFile(path, { schema }).then((rows, errors) => {
        res.send(rows);
        // const countrylist = rows.country.split('/n');
        // console.log(countrylist);
        // // `rows` is an array of rows
        // // each row being an array of cells.

        // if (errors && errors.length) {
        //     res.send(errors);
        // } else {
        //     res.send(rows);
        // }
    })

    // // Readable Stream.
    // readXlsxFile(fs.createReadStream(path)).then((rows) => {
    //     console.table('rows in stream', rows);
    // })
});

router.get('/api/readExcel', (req, res) => {
    XlsxPopulate.fromFileAsync(path)
    .then(workbook => {
        // Modify the workbook.
        
        const sheet = workbook.sheet("Sheet1")
        const value = workbook.sheet("Sheet1").cell("A1").value();
 
        // Log the value.
        console.log(sheet.row(1));
        res.send(value);
    });
});

module.exports = router;
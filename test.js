const fetch = require('node-fetch');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './file.csv',
    header: [
        { id: 'id', title: 'ID' },
        { id: 'email', title: 'EMAIL' }
    ]
});

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

fetch('https://reqres.in/api/users')
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        csvWriter.writeRecords(data.data)
            .then(() => {
                console.log('... Fetching Done');
                fs.createReadStream('file.csv')
                    .pipe(csv())
                    .on('data', (row) => {
                        console.log(row.ID + ":" + row.EMAIL);
                    })
                    .on('end', () => {
                        console.log('... Reading Done');
                    });
            });
    });


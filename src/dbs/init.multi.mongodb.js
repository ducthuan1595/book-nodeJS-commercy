const mongoose = require('mongoose');
require('dotenv').config();

function newConnection (uri) {
    const db = mongoose.createConnection(uri);

    db.on('error', err => {
        db.close().catch(() => console.error('Mongodb:: failed connection', this.name, err))
    })

    db.on('disconnect', err => {
        console.log(`Mongodb :: disconnected ${this.name} ${err}`);
    })

    db.on('connected', () => {
        mongoose.set('debug', (col, method, query, doc) => {
            console.log(`Mongodb Debug:: ${this.name}::${col}::${method}::${query}::${doc}`);
        })
    });

    return db;
}

const { TEST_URI, TEST_URI_1, TEST_URI_2 } = process.env;
const testdb = newConnection(TEST_URI);
const testdb1 = newConnection(TEST_URI_1);
const testdb2 = newConnection(TEST_URI_2);

module.exports = {
    testdb,
    testdb1,
    testdb2
}
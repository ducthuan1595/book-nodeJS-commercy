const fs = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const dateTime = `${format(new Date(), 'dd-MM-yyyy')}`;
const fileName = path.join(__dirname, '../logs', 'logs_'+ dateTime +'.log');
const logEvents = msg => {
    const time = `${format(new Date(), 'dd-MM-yyyy\tss:mm:HH')}`;
    const contentLog = `${time}---------${msg}\n`
    try{
        fs.appendFile(fileName, contentLog)
    }catch(err) {
        console.error(err);
    }
}

module.exports = logEvents;
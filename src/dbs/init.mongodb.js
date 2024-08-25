const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/book-ecommercy').then((_) => {
    console.log('Connected mongoose success!!!');
}).catch(err => console.error('Error connect::', err))

mongoose.set('debug', true);

mongoose.set('debug', {color: false});

mongoose.set('debug', {shell: true});

module.exports = mongoose;
const app = require('./src/app');

require("dotenv").config();
require('./src/dbs/init.mongodb');
// require('./src/dbs/init.multi.mongodb');

const port = process.env.PORT ?? 8000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


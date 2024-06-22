const app = require('./app');

require("dotenv").config();
require('./src/dbs/init.mongodb');
// require('./src/dbs/init.multi.mongodb');

const port = process.env.PORT ?? "5050";

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// mongoose
//   .connect(process.env.DATABASE_URL)
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on port: ${port}`);
//     });
//     console.log("Connect to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

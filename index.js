const mongoose = require('mongoose');
const app = require('./app');
require("dotenv").config();

const port = process.env.PORT ?? "5050";

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
    console.log("Connect to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

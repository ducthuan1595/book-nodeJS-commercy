const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const init = require("./router/init");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use("/", (req, res) => {
//   res.send("Hello world!");
// });

init(app);

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

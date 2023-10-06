const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileupload = require("express-fileupload");
require("dotenv").config();

const init = require("./router/init");
// const sortMiddleware = require("./middleware/sort");

const app = express();
const port = process.env.PORT ?? "5050";

app.set("view engine", "ejs");
app.set("views", "views");

// app.use(sortMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(fileupload());

init(app);

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
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

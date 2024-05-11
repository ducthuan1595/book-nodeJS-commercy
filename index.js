const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileupload = require("express-fileupload");
const session = require('express-session');
let RedisStore = require('connect-redis')(session)
const cookieParser = require('cookie-parser');


require("dotenv").config();

const { initRedis, redisClient } = require('./dbs/init.redis');
const init = require("./router/init");
const web = require('./router/web');

const app = express();
const port = process.env.PORT ?? "5050";

app.set("view engine", "ejs");
app.set("views", "views");

// app.use(sortMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);
app.use(fileupload());

// init redis
(async() => {
  await initRedis();
  const redisStore = new RedisStore({
    client: redisClient
  })
  
  // save session
  app.use(session({
    secret: 'book-app',
    resave: false,
    store: redisStore,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 5 * 60 * 1000
    }
  }))
})();

init(app);
web(app);

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

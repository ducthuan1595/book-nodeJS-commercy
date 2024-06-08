const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const session = require('express-session');
let RedisStore = require('connect-redis')(session)
const cookieParser = require('cookie-parser');


const { initRedis, redisClient } = require('./src/dbs/init.redis');
const init = require("./src/router/init");
const web = require('./src/router/web');

const app = express();


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

app.get('/', (req, res, next) => {
    res.send('Home Page!')
})

init(app);
web(app);

module.exports = app;
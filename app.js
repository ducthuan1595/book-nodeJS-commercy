const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const session = require('express-session');
let RedisStore = require('connect-redis')(session)
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const createError = require('http-errors')


const { initRedis, redisClient } = require('./src/dbs/init.redis');
const logEvents = require('./src/support/logEvents');
const routes = require('./src/router');

const app = express();


app.set("view engine", "ejs");
app.set("views", "views");
app.use(helmet());
app.use(morgan('common'));

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

app.use('/', routes);

app.use((req, res, next) => {
  next(createError(404, 'Not found'))
})

app.use((err, req, res, next) => {
  logEvents(`${req.url} -- ${req.method} -- ${err.message}`);
  res.status(err.status || 500);
  res.json({
      status: err.status || 500,
      message: err.message
  })
})

module.exports = app;
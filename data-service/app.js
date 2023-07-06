require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const redis = require('redis');
const session = require('express-session')
const redisStore = require('connect-redis')(session);

const checkSess = require('./middleware/session');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

const redisUrl = process.env.NODE_ENV === 'dev' ? process.env.SESSION_STORE : process.env.SESSION_STORE_PROD;
const client = redis.createClient(redisUrl);
//console.log('client',client)

const redisConfig = {
    client: client,
    ttl: 3600
};

app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore(redisConfig),
    saveUninitialized: false,
    resave: false
}));

app.use(checkSess);

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);
const usersRouter = require('./routes/user');
app.use('/api/users', usersRouter);
const orderRouter = require('./routes/order');
app.use('/api/orders', orderRouter);
module.exports = app;


const express = require('express');
const Middleware = require('./middleware/middleware');
const dotenv = require('dotenv');
const ErrorHandlingMiddleware = require('./middleware/error-handler');

dotenv.config();

const app = express();
Middleware(app);

const TreeController = require('./controllers/tree-controller');
app.use('/api/tree', TreeController);

ErrorHandlingMiddleware(app);

module.exports = app;
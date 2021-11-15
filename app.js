const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();

const medicosRouter = require('./routes/medicos');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/medicos', medicosRouter);
app.use('', swaggerUI.serve, swaggerUI.setup(swaggerFile));

module.exports = app;

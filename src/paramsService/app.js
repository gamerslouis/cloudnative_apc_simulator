const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const factorRouter = require('./routers/v1/factor');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('', factorRouter);

module.exports = app;

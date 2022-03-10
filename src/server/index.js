require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { notFoundError, generalError } = require("./middlewares/errors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use(notFoundError);
app.use(generalError);

module.exports = app;

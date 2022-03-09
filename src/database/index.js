const mongoose = require("mongoose");
const debug = require("debug")("shrink:database");
const chalk = require("chalk");

const databaseConnect = (mongoConnection) =>
  new Promise((resolve, reject) => {
    mongoose.connect(mongoConnection, (error) => {
      if (error) {
        reject(new Error(`Couldn't connect to the database: ${error.message}`));
        return;
      }
      debug(chalk.redBright("Connected to Database"));
      resolve();
    });
  });

module.exports = databaseConnect;

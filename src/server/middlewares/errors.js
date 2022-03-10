const chalk = require("chalk");
const debug = require("debug")("shrink:middlewares:errors");

const notFoundError = (req, res) => {
  debug(chalk.red("Endpoint not found"));
  res.status(404).json({ error: true, message: "Endpoint not found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  debug(chalk.red(`Error: ${err.message}`));
  const errorCode = err.code ?? 500;
  const errorMessage = err.code ? err.message : "Mama Weer All Crazee Now";
  res.status(errorCode).json({ error: true, message: errorMessage });
};

module.exports = {
  notFoundError,
  generalError,
};

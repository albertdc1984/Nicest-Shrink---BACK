require("dotenv").config();
const databaseConnect = require("./database");
const app = require("./server");
const serverUp = require("./server/serverUp");

const port = process.env.PORT || 4004;
const mongoConnection = process.env.MONGO_STRING;

(async () => {
  await serverUp(app, port);
  await databaseConnect(mongoConnection);
})();

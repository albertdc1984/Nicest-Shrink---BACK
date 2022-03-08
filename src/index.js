require("dotenv").config();
const app = require("./server");
const serverUp = require("./server");

const port = process.env.PORT || 4004;

(async () => {
  await serverUp(app, port);
})();

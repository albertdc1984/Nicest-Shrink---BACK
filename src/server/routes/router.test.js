require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoose = require("mongoose");
const request = require("supertest");
const databaseConnect = require("../../database/index");

const app = require("..");
const Session = require("../../database/models/Session");
const User = require("../../database/models/User");

let mongoServer;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();
  await databaseConnect(connectionString);
});

beforeEach(async () => {
  await Session.create({
    when: "1312-01-12",
    where: "Can Baró",
    patient: "6229d7be4197f335af2c3cac",
    doctor: "6229d8254197f335af2c3cad",
  });
  await User.create({
    name: "123456",
    lastname: "123456",
    username: "123456",
    password: "$2b$10$2rMqPvHpSA7OyeS9LdvejueLOTRFaAXoEvn73h70pQffd7UCVXbcu",
  });

  const { body } = await request(app)
    .post("/users/login")
    .send({ username: "123456", password: "123456" });

  userToken = body.token;
});

afterEach(async () => {
  await Session.deleteMany({});
  await User.deleteMany({});
});

afterAll(() => {
  mongoose.connection.close();
  mongoServer.stop();
});

describe("Given an endpoint /sessions", () => {
  describe("When it receives a GET request", () => {
    test("Then it should respond with status 200 and a list of sessions", async () => {
      const { body } = await request(app)
        .get("/sessions/")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toBeDefined();
    });
  });
});

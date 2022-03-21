require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoose = require("mongoose");
const request = require("supertest");
const databaseConnect = require("../../database/index");

const app = require("..");
const Session = require("../../database/models/Session");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();
  await databaseConnect(connectionString);

  await Session.create({
    when: "1312-01-12",
    where: "Can Baró",
    patient: "6229d7be4197f335af2c3cac",
    doctor: "6229d8254197f335af2c3cad",
  });
});

afterAll(async () => {
  await Session.deleteMany({});
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
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzNDU2IiwiaWQiOiI2MjM4YTYwYjhhZDM1OTdmODk2NTU0YTgiLCJpYXQiOjE2NDc4ODM2ODMsImV4cCI6MTY0ODIyOTI4M30.MX8-VT96Ig9Y1Xl_5zcGZsu49tXPs-GBTsgsQd0oYRQ"
        )
        .expect(200);

      expect(body).toBeDefined();
    });
  });
});

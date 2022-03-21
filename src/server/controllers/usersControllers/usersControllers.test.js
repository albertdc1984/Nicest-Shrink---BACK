require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../../database/models/User");
const { getAllUsers, userLogin } = require("./usersControllers");

jest.mock("../../../database/models/User.js");

describe("Given a getAllUsers controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a GET request ", () => {
    test("Then it should return a 200 status and a sessions array", async () => {
      const res = { json: jest.fn() };

      const users = [
        {
          name: "pepito",
          lastname: "grilo",
          username: "thegrilo",
          password: "12345",
        },
      ];

      User.find = jest.fn().mockResolvedValue(users);
      const next = jest.fn();

      await getAllUsers(null, res, next);
    });
  });
});

describe("Given an loginUser controller", () => {
  describe("When it receives a request with username Rosa0 and the correct password, and the user exists in db ", () => {
    test("Then it should call method json with the user's token in the receive response", async () => {
      const req = {
        body: { username: "123456", password: "123456" },
      };

      const user = {
        name: "123456",
        username: "123456",
        password:
          "$2b$10$2rMqPvHpSA7OyeS9LdvejueLOTRFaAXoEvn73h70pQffd7UCVXbcu",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      const userToken = jwt.sign(user, process.env.JWT_SECRET);

      const res = {
        json: jest.fn().mockResolvedValue(userToken),
      };

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with username Rosa0 and a incorrect password", () => {
    test("Then it should invoke next function with an error", async () => {
      const req = {
        body: { username: "123456", password: "nananana" },
      };

      const res = {};
      const next = jest.fn();

      const user = {
        name: "1234566666666666666",
        username: "Laura0",
        password:
          "$2b$10$dMTNK.KOdxL0WAa5v57J4eaRc/1HUGSmr5KSPC4PT17z.HqIOtoHK",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      const errorWrongPwd = new Error("User not found");

      errorWrongPwd.code = 401;

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(errorWrongPwd);
    });
  });

  describe("When it receives a request with a non-existent user", () => {
    test("Then it should invoke next function with an error", async () => {
      const req = {
        body: { username: "Nanana", password: "nananana" },
      };
      const res = {};
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(false);

      const error = new Error("User not found");

      error.code = 401;

      await userLogin(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

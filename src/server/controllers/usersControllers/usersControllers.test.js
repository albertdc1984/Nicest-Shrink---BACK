require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../../database/models/User");
const {
  getAllUsers,
  userLogin,
  getOneUser,
  createUser,
  updateUser,
  deleteOneUser,
} = require("./usersControllers");

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

describe("Given a getOneUser controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a GET request ", () => {
    test("Then it should return a 200 status and a session", async () => {
      const res = { json: jest.fn() };
      const req = { params: { id: "1" } };

      const user = {
        id: "1",
        name: "pepito",
        lastname: "grilo",
        username: "thegrilo",
        password: "12345",
      };

      User.findById = jest.fn().mockResolvedValue(user);
      const next = jest.fn();

      await getOneUser(req, res, next);
      expect(User.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
describe("Given a createUser controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a POST request ", () => {
    test("Then it should return a 200 status", async () => {
      const user = {
        id: "1",
        name: "pepito",
        lastname: "grilo",
        username: "thegrilo",
        password: "12345",
      };

      const req = {
        body: user,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      User.create = jest.fn().mockResolvedValue(req.body);
      await createUser(req, res, next);

      expect(User.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an deleteUser controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a DELETE request ", () => {
    test("Then it should return a 200 status", async () => {
      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findByIdAndRemove = jest.fn();
      await deleteOneUser(req, res, next);

      expect(User.findByIdAndRemove).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an updateUser controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a POST request ", () => {
    test("Then it should return a 200 status", async () => {
      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);
      await updateUser(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});

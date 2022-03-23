require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../../database/models/User");
const {
  getAllUsers,
  userLogin,
  getOneUser,
  createUser,
  updateUser,
  deleteOneUser,
} = require("./usersControllers");

mongoose.populate = jest.fn().mockReturnValueOnce("");

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

      User.find = jest.fn().mockReturnThis(users);
      User.populate = jest.fn().mockResolvedValue(users);
      const next = jest.fn();

      await getAllUsers(null, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it recieves a GET request ", () => {
    test("Then it should return a 200 status and an error", async () => {
      const res = { json: jest.fn() };

      const error = new Error();
      User.find = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockRejectedValue(error);
      const next = jest.fn();

      await getAllUsers(null, res, next);

      expect(next).toHaveBeenCalledWith(error);
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

  describe("When it receives a request with username 123456 and a incorrect password", () => {
    test("Then it should invoke next function with an error", async () => {
      const req = {
        body: { username: "123456", password: "nananana" },
      };

      const res = {};
      const next = jest.fn();

      const user = {
        name: "1234566666666666666",
        username: "Pepe",
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
        _id: "6229d8254197f335af2c3cad",
        name: "Dr Albert",
        lastname: "DC",
        username: "albertdc1984",
        password: "12345",
        admin: true,
        sessions: Array,
      };

      User.findById = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockResolvedValue(user);
      const next = jest.fn();

      await getOneUser(req, res, next);
      expect(User.findById).toHaveBeenCalled();
    });
    test("Then it should return an error when ids don't match", async () => {
      const res = { json: jest.fn() };
      const req = {};
      req.params = { id: "555555555" };

      const error = new Error();
      User.findById = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockRejectedValue(error);
      const next = jest.fn();

      await getOneUser(req, res, next);
      expect(User.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
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

      User.findByIdAndRemove = jest.fn().mockReturnThis();
      await deleteOneUser(req, res, next);

      expect(User.findByIdAndRemove).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test("Then it should return a 200 status", async () => {
      const req = { params: { id: "1" } };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const error = new Error();

      User.findByIdAndRemove = jest.fn().mockRejectedValue(error);
      await deleteOneUser(req, res, next);

      expect(User.findByIdAndRemove).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
    test("Then it should call next method with an error: 'Couldn't find session", async () => {
      const req = { params: { id: "1afgadfa" } };
      const next = jest.fn();

      const error = new Error("User not found");

      User.findOneAndRemove = jest.fn().mockRejectedValue(error);

      await deleteOneUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
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
      req.body = {
        id: "1",
        name: "pepito",
        lastname: "grilo",
        username: "thegrilo",
        password: "12345",
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);
      User.populate = jest.fn().mockResolvedValue(req.body);
      await updateUser(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it recieves a POST request ", () => {
    test("Then it should return an error", async () => {
      const req = {};
      req.params = { id: "12222312312312312" };
      const res = {};
      const next = jest.fn();
      const error = new Error("Couldn't update user");
      User.findByIdAndUpdate = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockRejectedValue(error);

      await updateUser(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });

    test("Then it should return an error", async () => {
      const req = {};
      req.params = { id: "12222312312312312" };
      const next = jest.fn();
      const error = new Error("User not found");
      User.findOneAndUpdate = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockRejectedValue(error);

      await updateUser(req, null, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

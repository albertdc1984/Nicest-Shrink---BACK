const Session = require("../../../database/models/Session");
const {
  getAllSessions,
  getOneSession,
  deleteOneSession,
} = require("./sessionsControllers");

jest.mock("../../../database/models/Session.js");

describe("Given a getAllSessions controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a GET request ", () => {
    test("Then it should return a 200 status and a sessions array", async () => {
      const sessions = [
        {
          when: Date.now(),
          where: "Can Baró",
          patient: { name: "pepito" },
          doctor: { name: "pepitogrilo" },
        },
      ];
      const next = jest.fn();
      const res = { json: jest.fn() };
      Session.find = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockResolvedValue(sessions);

      await getAllSessions(null, res, next);

      expect(Session.find).toHaveBeenCalled();
    });
  });
});

describe("Given a deleteOneSession controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a DELETE request ", () => {
    test("Then it should return a 200 status and a Session deleted message", async () => {
      const session = {
        id: "1a",
        when: Date.now(),
        where: "Can Baró",
        patient: {},
        doctor: {},
      };

      const next = jest.fn();

      const req = { params: { id: "1a" } };
      const res = { json: jest.fn() };

      Session.findByIdAndRemove = jest.fn().mockResolvedValue({ session });

      await deleteOneSession(req, res, next);

      expect(Session.findByIdAndRemove).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an invalid id to delete", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        params: { id: "1" },
      };

      const next = jest.fn();
      const error = new Error("Id not valid");

      Session.findByIdAndRemove = jest.fn().mockRejectedValue(error);

      await deleteOneSession(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getOneSession controller", () => {
  describe("When it receives a GET request qith a valid ID", () => {
    test("Then it shoul return a session object", async () => {
      const req = { params: { id: "1a" } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      const session = {
        id: "1a",
        when: Date.now(),
        where: "Can Baró",
        patient: {},
        doctor: {},
      };

      Session.findById = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockResolvedValue(session);

      await getOneSession(req, res, next);

      expect(Session.findById).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });
});

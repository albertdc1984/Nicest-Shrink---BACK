const Session = require("../../../database/models/Session");
const { getAllSessions, getOneSession } = require("./sessionsControllers");

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

describe("Given a getOneSession controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a GET request ", () => {
    test("Then it should return a 200 status and a session object", async () => {
      const session = {
        id: "1a",
        when: Date.now(),
        where: "Can Baró",
        patient: { name: "pepito" },
        doctor: { name: "pepitogrilo" },
      };

      const next = jest.fn();

      const req = { params: { id: "1a" } };
      const res = { json: jest.fn() };

      Session.findById = jest.fn().mockResolvedValue({ session });
      Session.populate = jest.fn().mockResolvedValue({ session });

      await getOneSession(req, res, next);

      expect(Session.findById).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ session });
    });
  });

  describe("When it recieves no session in response", () => {
    test("Then it should throw an error", async () => {
      const next = jest.fn();
      const req = { params: { id: "1" } };
      const res = { id: null };
      await getOneSession(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

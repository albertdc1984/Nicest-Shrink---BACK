const Session = require("../../../database/models/Session");
const getAllSessions = require("./sessionsControllers");

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
      Session.find = jest.fn().mockResolvedValue(sessions);

      await getAllSessions(null, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

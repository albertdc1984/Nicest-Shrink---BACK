const User = require("../../../database/models/User");
const getAllUsers = require("./usersControllers");

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

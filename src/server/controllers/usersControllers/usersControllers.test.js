const User = require("../../../database/models/User");
const getAllUsers = require("./usersControllers");

jest.mock("../../../database/models/User.js");

describe("Given a getAllUsers controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it recieves a GET request ", () => {
    test("Then it should return a 200 status and a sessions array", async () => {
      const users = [
        {
          name: "pepito",
          lastname: "grilo",
          username: "thegrilo",
          password: "12345",
          admin: false,
          sessions: [null],
          progress: "Not progressing",
        },
      ];
      const next = jest.fn();
      const res = { json: jest.fn() };

      User.find = jest.fn().mockResolvedValue(users);

      await getAllUsers(null, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

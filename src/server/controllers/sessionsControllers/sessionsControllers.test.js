const Session = require("../../../database/models/Session");
const {
  getAllSessions,
  getOneSession,
  deleteOneSession,
  createSession,
  updateOneSession,
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

    test("Then it should return a 200 status and a sessions array", async () => {
      const next = jest.fn();
      const res = { json: jest.fn() };
      const error = new Error();

      Session.find = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue(error);

      await getAllSessions(null, res, next);

      expect(next).toHaveBeenCalledWith(error);
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

      Session.findByIdAndRemove = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue({ session });

      await deleteOneSession(req, res, next);

      expect(Session.findByIdAndRemove).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
    describe("When it receives a request with wrong id", () => {
      test("Then it should call next method with an error: 'Couldn't find session", async () => {
        const req = { params: { id: "1afgadfa" } };
        const next = jest.fn();

        const error = new Error("Session not found");

        Session.findOneAndRemove = jest.fn().mockReturnThis();
        Session.populate = jest.fn().mockRejectedValue(error);

        await deleteOneSession(req, null, next);

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("When it receives an invalid id to delete", () => {
    test("Then it should call next with an error", async () => {
      const expectedErrorMessage = "Session not found";
      Session.findOneAndRemove = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue(new Error());
      const next = jest.fn();
      const res = null;
      const req = {
        params: {
          id: "asdasd3232sasdasd",
        },
      };

      await deleteOneSession(req, res, next);
      const errorMessage = next.mock.calls[0][0].message;

      expect(errorMessage).toBe(expectedErrorMessage);
    });
  });
});

describe("Given a getOneSession controller", () => {
  describe("When it receives a GET request qith a valid ID", () => {
    test("Then it should return a session object", async () => {
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

    test("Then it should return a session object", async () => {
      const req = {};
      req.params = {
        id: "1a",
      };

      const next = jest.fn();

      const error = new Error("User not found");

      Session.findOne = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue(error);

      await getOneSession(req, null, next);

      expect(Session.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });

    test("Then it should return a session object", async () => {
      const req = { params: { id: "1asdfsdfsdf" } };

      const next = jest.fn();

      const error = new Error("Something went wrong");

      Session.findById = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue(error);

      await getOneSession(req, null, next);

      expect(Session.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createSession controller", () => {
  describe("When it receives a request", () => {
    test("Then it should call method json", async () => {
      const newSession = {
        _id: "6229d6f84197f335af2c3ca9",
        when: "1312-01-12T00:14:44.000Z",
        where: "Can Baró",
        patient: "6230586642f13caa9b0c2252",
        doctor: "6229d8254197f335af2c3cad",
      };
      const req = {
        body: newSession,
      };
      const res = {
        json: jest.fn(),
      };

      Session.create = jest.fn().mockResolvedValue(req.body);

      await createSession(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(newSession);
    });
  });

  describe("When it receives request with invalid format of data", () => {
    test("Then it should call next with error 'Invalid data format'", async () => {
      const newSession = {
        patient: "6230586642f13caa9b0c2252",
        doctor: "6229d8254197f335af2c3cad",
      };

      const req = {
        body: newSession,
      };
      const next = jest.fn();
      const error = new Error("Invalid data format");

      Session.create = jest.fn().mockResolvedValue(null);

      await createSession(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request and database isn't connected", () => {
    test("Then it should call next method with an error: 'Couldn't create session", async () => {
      const newSession = {
        _id: "6229d6f84197f335af2c3ca9",
        when: "1312-01-12T00:14:44.000Z",
        where: "Can Baró",
        patient: "6230586642f13caa9b0c2252",
        doctor: "6229d8254197f335af2c3cad",
      };

      const req = {
        body: newSession,
      };
      const next = jest.fn();

      const error = new Error("Couldn't create session");

      Session.create = jest.fn().mockRejectedValue(error);

      await createSession(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given an updateSession controller", () => {
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

      Session.findByIdAndUpdate = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockResolvedValue(req.body);
      await updateOneSession(req, res, next);

      expect(Session.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test("Then it should return an error status", async () => {
      const req = { params: { id: "1" } };
      const res = {};
      const next = jest.fn();
      const error = new Error("Couldn't update session");
      Session.findByIdAndUpdate = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue(error);
      await updateOneSession(req, res, next);

      expect(Session.findByIdAndUpdate).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
    test("Then it should return an error status", async () => {
      const req = { params: { id: "1" } };
      const next = jest.fn();
      const error = new Error("Session not found");
      Session.findOne = jest.fn().mockReturnThis();
      Session.populate = jest.fn().mockRejectedValue(error);
      await updateOneSession(req, null, next);

      expect(Session.findByIdAndUpdate).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given an deleteSession controller", () => {
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
      const error = new Error();

      Session.findByIdAndRemove = jest.fn().mockRejectedValue(error);
      await deleteOneSession(req, res, next);

      expect(Session.findByIdAndRemove).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

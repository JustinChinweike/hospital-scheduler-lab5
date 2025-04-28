// backend/src/controllers/__tests__/scheduleController.test.ts
/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { Request, Response, NextFunction } from "express";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../scheduleController";
import { schedules } from "../../models/scheduleModel";
import { v4 as uuid } from "uuid";

/* ------------------------------------------------------------------ */
/* mocks                                                              */
/* ------------------------------------------------------------------ */

// --- mock socket.io -------------------------------------------------
jest.mock("../../socket", () => ({
  io: { emit: jest.fn() },
}));

// --- helper that returns a typed mock Response ----------------------
const mockResponse = () => {
  const res = {} as Response & {
    sendStatus: jest.Mock;
  };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  // controllers use res.sendStatus(204) → make it delegate to .status()
  res.sendStatus = jest.fn().mockImplementation((code: number) => {
    (res.status as jest.Mock).mock.calls.length
      ? null
      : res.status(code); // call status(…) once if it hasn’t been used
    return res;
  });
  return res;
};

// --- helper for mock Request ---------------------------------------
const mockRequest = (
  body: any = {},
  params: any = {},
  query: any = {}
) => ({ body, params, query } as unknown as Request);

// --- dummy third arg for RequestHandler -----------------------------
const dummyNext: NextFunction = jest.fn();

/* ------------------------------------------------------------------ */
/* reset between tests                                                */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  schedules.length = 0; // wipe in-memory “DB”
  jest.clearAllMocks();
});

/* ------------------------------------------------------------------ */
/* test-suite                                                         */
/* ------------------------------------------------------------------ */

describe("Schedule Controller", () => {
  /* ------------------------- createSchedule ----------------------- */
  describe("createSchedule", () => {
    it("creates a new schedule", () => {
      const req = mockRequest({
        doctorName: "Dr. Smith",
        patientName: "John Doe",
        dateTime: "2024-04-11T10:00:00Z",
        department: "Cardiology",
      });
      const res = mockResponse();

      createSchedule(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(schedules).toHaveLength(1);
      expect(schedules[0]).toMatchObject({
        doctorName: "Dr. Smith",
        patientName: "John Doe",
        department: "Cardiology",
      });
    });

    it("returns 400 for invalid data", () => {
      const req = mockRequest({
        doctorName: "Dr", // too short
        patientName: "John Doe",
        dateTime: "invalid-date",
        department: "Cardiology",
      });
      const res = mockResponse();

      createSchedule(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
      );
    });
  });

  /* ------------------------- getSchedules ------------------------- */
  describe("getSchedules", () => {
    beforeEach(() => {
      schedules.push(
        {
          id: uuid(),
          doctorName: "Dr. Smith",
          patientName: "John Doe",
          dateTime: "2024-04-11T10:00:00Z",
          department: "Cardiology",
        },
        {
          id: uuid(),
          doctorName: "Dr. Johnson",
          patientName: "Jane Smith",
          dateTime: "2024-04-12T14:00:00Z",
          department: "Neurology",
        }
      );
    });

    it("returns all schedules", () => {
      const req = mockRequest();
      const res = mockResponse();

      getSchedules(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ doctorName: "Dr. Smith" }),
            expect.objectContaining({ doctorName: "Dr. Johnson" }),
          ]),
        })
      );
    });

    it("filters by department", () => {
      const req = mockRequest({}, {}, { department: "Cardiology" });
      const res = mockResponse();

      getSchedules(req, res, dummyNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ department: "Cardiology" }),
          ]),
        })
      );
      // ensures Neurology was filtered out
      expect(
        (res.json as jest.Mock).mock.calls[0][0].data
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ department: "Neurology" }),
        ])
      );
    });

    it("sorts by date ascending", () => {
      const req = mockRequest(
        {},
        {},
        { sortBy: "dateTime", sortOrder: "asc" }
      );
      const res = mockResponse();

      getSchedules(req, res, dummyNext);

      const dates = (res.json as jest.Mock).mock.calls[0][0].data.map(
        (s: any) => new Date(s.dateTime).getTime()
      );
      expect(dates).toEqual([...dates].sort((a, b) => a - b));
    });
  });

  /* ------------------------- updateSchedule ----------------------- */
  describe("updateSchedule", () => {
    let scheduleId: string;

    beforeEach(() => {
      scheduleId = uuid();
      schedules.push({
        id: scheduleId,
        doctorName: "Dr. Smith",
        patientName: "John Doe",
        dateTime: "2024-04-11T10:00:00Z",
        department: "Cardiology",
      });
    });

    it("updates an existing schedule", () => {
      const req = mockRequest(
        { doctorName: "Dr. Smith Updated" },
        { id: scheduleId }
      );
      const res = mockResponse();

      updateSchedule(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(schedules[0].doctorName).toBe("Dr. Smith Updated");
    });

    it("returns 404 for non-existent schedule", () => {
      const req = mockRequest(
        { doctorName: "X" },
        { id: "non-existent-id" }
      );
      const res = mockResponse();

      updateSchedule(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  /* ------------------------- deleteSchedule ----------------------- */
  describe("deleteSchedule", () => {
    let scheduleId: string;

    beforeEach(() => {
      scheduleId = uuid();
      schedules.push({
        id: scheduleId,
        doctorName: "Dr. Smith",
        patientName: "John Doe",
        dateTime: "2024-04-11T10:00:00Z",
        department: "Cardiology",
      });
    });

    it("deletes an existing schedule", () => {
      const req = mockRequest({}, { id: scheduleId });
      const res = mockResponse();

      deleteSchedule(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(schedules).toHaveLength(0);
    });

    it("returns 404 for non-existent schedule", () => {
      const req = mockRequest({}, { id: "non-existent-id" });
      const res = mockResponse();

      deleteSchedule(req, res, dummyNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MyAttendance from "./MyAttendance";
import attendanceReducer from "../../../store/Reducers/attendanceReducer";
import authReducer from "../../../store/Reducers/authReducer";

// Mock the date utilities
jest.mock("../../../utils/phDateUtils", () => ({
  formatDatePH: jest.fn((date, format) => {
    if (format === "YYYY-MM-DD") return "2025-07-15";
    if (format === "MMMM D, YYYY") return "July 15, 2025";
    if (format === "dddd") return "Tuesday";
    return "Formatted Date";
  }),
  getTodayDatePH: jest.fn(() => new Date("2025-07-15")),
  formatTimeTo12HourPH: jest.fn((time) => "9:00 AM"),
  getAttendanceDateRangePH: jest.fn((type) => ({
    start: new Date("2025-07-08"),
    end: new Date("2025-07-15"),
  })),
}));

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
  },
  preloadedState: {
    auth: {
      userInfo: {
        employee: "12345",
      },
    },
    attendance: {
      loading: false,
      attendances: [
        {
          datePH: "2025-07-15",
          status: "Present",
          timeIn: "2025-07-15T09:00:00Z",
          timeOut: "2025-07-15T17:00:00Z",
          lateMinutes: 0,
          scheduleString: "9:00 AM - 5:00 PM",
          shiftName: "Regular Shift",
          remarks: "On time",
        },
      ],
      errorMessage: "",
    },
  },
});

describe("MyAttendance Component", () => {
  it("renders without crashing", () => {
    render(
      <Provider store={mockStore}>
        <MyAttendance />
      </Provider>
    );

    expect(screen.getByText("My Attendance")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    const loadingStore = configureStore({
      reducer: {
        auth: authReducer,
        attendance: attendanceReducer,
      },
      preloadedState: {
        auth: {
          userInfo: {
            employee: "12345",
          },
        },
        attendance: {
          loading: true,
          attendances: [],
          errorMessage: "",
        },
      },
    });

    render(
      <Provider store={loadingStore}>
        <MyAttendance />
      </Provider>
    );

    // Check for loading skeleton
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("displays attendance data", () => {
    render(
      <Provider store={mockStore}>
        <MyAttendance />
      </Provider>
    );

    expect(screen.getByText("Present")).toBeInTheDocument();
    expect(screen.getByText("Regular Shift")).toBeInTheDocument();
  });
});

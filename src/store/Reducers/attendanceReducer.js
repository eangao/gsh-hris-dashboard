import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchAttendanceByDepartment = createAsyncThunk(
  "attendance/fetchAttendanceByDepartment",
  async (
    { scheduleId, employeeId = "", perPage, page, searchValue, requestId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/attendances/schedule-attendance-preview-v2/${scheduleId}`,
        {
          params: {
            perPage,
            page,
            searchValue,
            employeeId, // optional, for specific employee in department only
          },
          withCredentials: true,
        }
      );

      return fulfillWithValue({ ...data, requestId });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    attendances: [],
    attendance: "",
    totalAttendance: 0,
    dutyScheduleInfo: {},
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    clearAttendance: (state) => {
      state.attendances = [];
      state.attendance = "";
      state.totalAttendance = 0;
      state.errorMessage = "";
      state.successMessage = "";
      state.loading = false;
      state.dutyScheduleInfo = {};
    },
    clearState: (state) => {
      state.loading = false;
      state.successMessage = "";
      state.errorMessage = "";
      state.attendances = [];
      state.attendance = "";
      state.totalAttendance = 0;
      state.dutyScheduleInfo = {};
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchAttendanceByDepartment.pending, (state, { meta }) => {
        state.loading = true;
        state.errorMessage = "";
        state.attendances = [];
        state.totalAttendance = 0;
        state.dutyScheduleInfo = {};
      })
      .addCase(fetchAttendanceByDepartment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendances = payload.attendances;
        state.totalAttendance = payload.totalAttendance;
        state.dutyScheduleInfo = payload.dutyScheduleInfo;
      })
      .addCase(fetchAttendanceByDepartment.rejected, (state, { payload }) => {
        state.loading = false;
        state.attendances = [];
        state.totalAttendance = 0;
        state.dutyScheduleInfo = {};
        state.errorMessage = payload?.error || "Failed to load attendance data";
      });
  },
});

export const { messageClear, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;

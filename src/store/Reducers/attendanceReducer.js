import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchAttendanceByEmployee = createAsyncThunk(
  "attendance/fetchAttendanceByEmployee",
  async (
    { employeeId, startDate, endDate },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/attendances/employee/${employeeId}/attendance-by-date-range`,
        { params: { startDate, endDate }, withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAttendanceByDepartment = createAsyncThunk(
  "attendance/fetchAttendanceByDepartment",
  async ({ scheduleId, employeeId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/hris/attendances/schedule-attendance-preview/${scheduleId}`,
        { params: { employeeId }, withCredentials: true }
      );

      return fulfillWithValue(data);
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
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceByEmployee.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchAttendanceByEmployee.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendances = payload.attendances;
        state.errorMessage = "";
      })
      .addCase(fetchAttendanceByEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.error;
      });

    builder
      .addCase(fetchAttendanceByDepartment.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(fetchAttendanceByDepartment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.attendances = payload.attendances;
        state.errorMessage = "";
      })
      .addCase(fetchAttendanceByDepartment.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.error;
      });
  },
});

export const { messageClear } = attendanceSlice.actions;
export default attendanceSlice.reducer;

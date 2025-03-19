import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunks for API calls
export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async (date) => {
    try {
      const response = await api.get(`/attendance?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData) => {
    try {
      const response = await api.post("/attendance", attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  attendanceRecords: [],
  loading: false,
  error: null,
  message: "",
  success: false,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = "";
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Attendance marked successfully";
        state.attendanceRecords = [...state.attendanceRecords, action.payload];
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearMessage } = attendanceSlice.actions;
export default attendanceSlice.reducer;

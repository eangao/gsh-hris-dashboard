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

export const logManualAttendance = createAsyncThunk(
  "attendance/logManualAttendance",
  async (manualAttendanceData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/hris/attendances/manual-attendance",
        manualAttendanceData,
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateManualAttendance = createAsyncThunk(
  "attendance/updateManualAttendance",
  async ({ logId, ...updateData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/attendances/manual-attendance/${logId}`,
        updateData,
        {
          withCredentials: true,
        }
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
    manualAttendanceLoading: false, // Separate loading for manual attendance
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
      })

      // Manual attendance handlers
      .addCase(logManualAttendance.pending, (state) => {
        state.manualAttendanceLoading = true;
        state.errorMessage = "";
      })
      .addCase(logManualAttendance.fulfilled, (state, { payload }) => {
        state.manualAttendanceLoading = false;
        state.successMessage =
          payload.message || "Manual attendance logged successfully";

        // Update the specific attendance record in the state
        if (payload.updatedAttendance) {
          const attendanceIndex = state.attendances.findIndex(
            (attendance) => attendance._id === payload.updatedAttendance._id
          );
          if (attendanceIndex !== -1) {
            state.attendances[attendanceIndex] = payload.updatedAttendance;
          }
        }
      })
      .addCase(logManualAttendance.rejected, (state, { payload }) => {
        state.manualAttendanceLoading = false;
        state.errorMessage =
          payload?.error || "Failed to log manual attendance";
      })

      // Update manual attendance handlers
      .addCase(updateManualAttendance.pending, (state) => {
        state.manualAttendanceLoading = true;
        state.errorMessage = "";
      })
      .addCase(updateManualAttendance.fulfilled, (state, { payload }) => {
        state.manualAttendanceLoading = false;
        state.successMessage =
          payload.message || "Manual attendance updated successfully";

        // Update the specific attendance record in the state
        if (payload.updatedAttendance) {
          const attendanceIndex = state.attendances.findIndex(
            (attendance) => attendance._id === payload.updatedAttendance._id
          );
          if (attendanceIndex !== -1) {
            state.attendances[attendanceIndex] = payload.updatedAttendance;
          }
        }
      })
      .addCase(updateManualAttendance.rejected, (state, { payload }) => {
        state.manualAttendanceLoading = false;
        state.errorMessage =
          payload?.error || "Failed to update manual attendance";
      });
  },
});

export const { messageClear, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;

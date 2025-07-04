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
        `/hris/attendances/employee/${employeeId}/daily-summary`,
        { params: { startDate, endDate }, withCredentials: true }
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
    builder.addCase(
      fetchAttendanceByEmployee.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.attendances = payload.attendances;
      }
    );
  },
});

export const { messageClear } = attendanceSlice.actions;
export default attendanceSlice.reducer;

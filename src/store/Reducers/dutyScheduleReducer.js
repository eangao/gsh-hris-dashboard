import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchDutySchedules = createAsyncThunk(
  "dutySchedule/fetchDutySchedules",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/duty-schedule");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDutySchedule = createAsyncThunk(
  "dutySchedule/createDutySchedule",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/duty-schedule", scheduleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDutySchedule = createAsyncThunk(
  "dutySchedule/updateDutySchedule",
  async ({ id, scheduleData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/duty-schedule/${id}`, scheduleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDutySchedule = createAsyncThunk(
  "dutySchedule/deleteDutySchedule",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/duty-schedule/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dutyScheduleSlice = createSlice({
  name: "dutySchedule",
  initialState: {
    schedules: {},
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    messageClear: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },
    updateLocalSchedule: (state, action) => {
      const { dateKey, schedules } = action.payload;
      state.schedules = {
        ...state.schedules,
        [dateKey]: schedules,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Schedules
    builder.addCase(fetchDutySchedules.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDutySchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.schedules = action.payload;
    });
    builder.addCase(fetchDutySchedules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Create Schedule
    builder.addCase(createDutySchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createDutySchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Schedule created successfully";
      const { dateKey, schedule } = action.payload;
      state.schedules[dateKey] = [
        ...(state.schedules[dateKey] || []),
        schedule,
      ];
    });
    builder.addCase(createDutySchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Update Schedule
    builder.addCase(updateDutySchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDutySchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Schedule updated successfully";
      const { dateKey, schedule } = action.payload;
      state.schedules[dateKey] = state.schedules[dateKey].map((s) =>
        s.id === schedule.id ? schedule : s
      );
    });
    builder.addCase(updateDutySchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Delete Schedule
    builder.addCase(deleteDutySchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDutySchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Schedule deleted successfully";
      const { dateKey, id } = action.payload;
      state.schedules[dateKey] = state.schedules[dateKey].filter(
        (s) => s.id !== id
      );
    });
    builder.addCase(deleteDutySchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

export const { messageClear, updateLocalSchedule } = dutyScheduleSlice.actions;
export default dutyScheduleSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchWorkSchedules = createAsyncThunk(
  "workSchedule/fetchWorkSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/work-schedule");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createWorkSchedule = createAsyncThunk(
  "workSchedule/createWorkSchedule",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/work-schedule", scheduleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateWorkSchedule = createAsyncThunk(
  "workSchedule/updateWorkSchedule",
  async ({ id, scheduleData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/work-schedule/${id}`, scheduleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWorkSchedule = createAsyncThunk(
  "workSchedule/deleteWorkSchedule",
  async ({ id, dateKey }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/work-schedule/${id}`);
      return { id, dateKey, ...data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const workScheduleSlice = createSlice({
  name: "workSchedule",
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
    builder.addCase(fetchWorkSchedules.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWorkSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.schedules = action.payload || {};
    });
    builder.addCase(fetchWorkSchedules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Create Schedule
    builder.addCase(createWorkSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createWorkSchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Schedule created successfully";
      const { dateKey, schedule } = action.payload;
      if (!state.schedules[dateKey]) {
        state.schedules[dateKey] = [];
      }
      state.schedules[dateKey] = [...state.schedules[dateKey], schedule];
    });
    builder.addCase(createWorkSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Update Schedule
    builder.addCase(updateWorkSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateWorkSchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Schedule updated successfully";
      const { dateKey, schedule } = action.payload;
      if (state.schedules[dateKey]) {
        state.schedules[dateKey] = state.schedules[dateKey].map((s) =>
          s.id === schedule.id ? schedule : s
        );
      }
    });
    builder.addCase(updateWorkSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Delete Schedule
    builder.addCase(deleteWorkSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteWorkSchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Schedule deleted successfully";
      const { dateKey, id } = action.payload;
      if (state.schedules[dateKey]) {
        state.schedules[dateKey] = state.schedules[dateKey].filter(
          (s) => s.id !== id
        );
      }
    });
    builder.addCase(deleteWorkSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

export const { messageClear, updateLocalSchedule } = workScheduleSlice.actions;
export default workScheduleSlice.reducer;

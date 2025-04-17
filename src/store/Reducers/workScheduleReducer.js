import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchWorkSchedules = createAsyncThunk(
  "workSchedule/fetchWorkSchedules",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/fetch-work-schedules?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const createWorkSchedule = createAsyncThunk(
  "workSchedule/createWorkSchedule",
  async (scheduleData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/create-work-schedule", scheduleData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateWorkSchedule = createAsyncThunk(
  "workSchedule/updateWorkSchedule",
  async ({ id, scheduleData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/work-schedule/${id}`, scheduleData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWorkSchedule = createAsyncThunk(
  "workSchedule/deleteWorkSchedule",
  async ({ id, dateKey }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/work-schedule/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const workScheduleSlice = createSlice({
  name: "workSchedule",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    schedules: [],
    schedule: "",
    totalSchedule: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch Schedules
    builder.addCase(fetchWorkSchedules.fulfilled, (state, { payload }) => {
      state.totalSchedule = payload.totalSchedule;
      state.schedules = payload.schedules;
    });

    // Create Schedule
    builder
      .addCase(createWorkSchedule.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createWorkSchedule.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createWorkSchedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import WorkSchedule from "./../../views/admin/WorkSchedule";

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
  async ({ _id, ...scheduleData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/update-work-schedule/${_id}`,
        scheduleData,
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

export const deleteWorkSchedule = createAsyncThunk(
  "workSchedule/deleteWorkSchedule",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-work-schedule/${id}`, {
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
    workSchedules: [],
    workSchedule: "",
    totalWorkSchedule: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch workScheduless
    builder.addCase(fetchWorkSchedules.fulfilled, (state, { payload }) => {
      state.totalWorkSchedule = payload.totalWorkSchedule;
      state.workSchedules = payload.workSchedules;
    });

    // Create workSchedules
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

    // Update workSchedules
    builder
      .addCase(updateWorkSchedule.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateWorkSchedule.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateWorkSchedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete workSchedules
    builder
      .addCase(deleteWorkSchedule.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteWorkSchedule.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteWorkSchedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted workSchedules from the state
        state.workSchedules = state.workSchedules.filter(
          (workSchedule) => workSchedule._id !== payload.workScheduleId
        );
      });
  },
});

export const { messageClear } = workScheduleSlice.actions;
export default workScheduleSlice.reducer;

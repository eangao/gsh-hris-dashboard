import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchDutySchedules = createAsyncThunk(
  "dutySchedule/fetchDutySchedules",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/duty-schedules?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

//for edit
export const fetchDutyScheduleById = createAsyncThunk(
  "dutySchedule/fetchDutyScheduleById",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/hris/duty-schedules/${id}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDutySchedule = createAsyncThunk(
  "dutySchedule/createDutySchedule",
  async (scheduleData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/hris/duty-schedules", scheduleData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDutySchedule = createAsyncThunk(
  "dutySchedule/updateDutySchedule",
  async ({ _id, ...scheduleData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/duty-schedules/${_id}`,
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

export const deleteDutySchedule = createAsyncThunk(
  "dutySchedule/deleteDutySchedule",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/hris/duty-schedules/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add new thunk to fetch schedules by department
export const fetchDutySchedulesByDepartment = createAsyncThunk(
  "dutySchedule/fetchDutySchedulesByDepartment",
  async (
    { departmentId, perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    console.log(departmentId);
    try {
      const { data } = await api.get(
        `/hris/duty-schedules/by-department/${departmentId}?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dutyScheduleSlice = createSlice({
  name: "dutySchedule",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    dutySchedules: [],
    dutySchedule: "",
    totalDutySchedule: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDutySchedules.fulfilled, (state, { payload }) => {
        state.totalDutySchedule = payload.totalDutySchedule;
        state.dutySchedules = payload.dutySchedules;
      })
      .addCase(fetchDutyScheduleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDutyScheduleById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.dutySchedule = payload.dutySchedule;
      })
      .addCase(fetchDutyScheduleById.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      });

    builder
      .addCase(createDutySchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDutySchedule.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createDutySchedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.dutySchedules = [
          ...state.dutySchedules,
          payload.dutySchedule,
        ].sort((a, b) => a.name.localeCompare(b.name));
        state.totalDutySchedule = state.totalDutySchedule + 1;
      });

    builder
      .addCase(updateDutySchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDutySchedule.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateDutySchedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    builder
      .addCase(deleteDutySchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDutySchedule.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteDutySchedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.dutySchedules = state.dutySchedules.filter(
          (schedule) => schedule._id !== payload.dutyScheduleId
        );
      });

    builder.addCase(
      fetchDutySchedulesByDepartment.fulfilled,
      (state, { payload }) => {
        state.totalDutySchedule = payload.totalDutySchedule;
        state.dutySchedules = payload.dutySchedules;
      }
    );
  },
});

export const { messageClear } = dutyScheduleSlice.actions;
export default dutyScheduleSlice.reducer;

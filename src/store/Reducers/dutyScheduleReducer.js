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
    try {
      const { data } = await api.get(
        `/hris/duty-schedules/by-department/${departmentId}?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

// Add new thunk to submit duty schedule for approval
export const submitDutyScheduleForApproval = createAsyncThunk(
  "dutySchedule/submitDutyScheduleForApproval",
  async ({ id, action, password }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/hris/duty-schedules/${id}/submit`,
        { action, password },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unknown error" }
      );
    }
  }
);

// Add new thunk to fetch schedules by cluster
export const fetchDutySchedulesForDirectorApprovalByCluster = createAsyncThunk(
  "dutySchedule/fetchDutySchedulesForDirectorApprovalByCluster",
  async (
    { clusterId, perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/duty-schedules/pending-director-approval/${clusterId}?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

// Add new thunk to fetch schedules for HR approval
export const fetchHrDutySchedulesByStatus = createAsyncThunk(
  "dutySchedule/fetchHrDutySchedulesByStatus",
  async (
    { perPage, page, searchValue, statusFilter },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/duty-schedules/hr-approval/?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}&&statusFilter=${statusFilter}`,
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unknown error" }
      );
    }
  }
);

// Add new thunk for director approval/rejection
export const directorApproval = createAsyncThunk(
  "dutySchedule/directorApproval",
  async (
    { id, action, remarks, password },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post(
        `/hris/duty-schedules/${id}/director-approval`,
        { action, remarks, password },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unknown error" }
      );
    }
  }
);

// Add new thunk for HR approval/rejection
export const hrApproval = createAsyncThunk(
  "dutySchedule/hrApproval",
  async (
    { id, action, remarks, password },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post(
        `/hris/duty-schedules/${id}/hr-approval`,
        { action, remarks, password },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Unknown error" }
      );
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

    // Handle fetchDutySchedulesForDirectorApprovalByCluster
    builder.addCase(
      fetchDutySchedulesForDirectorApprovalByCluster.fulfilled,
      (state, { payload }) => {
        state.totalDutySchedule = payload.totalDutySchedule;
        state.dutySchedules = payload.dutySchedules;
      }
    );

    // Handle fetchHrDutySchedulesByStatus
    builder.addCase(
      fetchHrDutySchedulesByStatus.fulfilled,
      (state, { payload }) => {
        state.totalDutySchedule = payload.totalDutySchedule;
        state.dutySchedules = payload.dutySchedules;
      }
    );

    // Handle submitDutyScheduleForApproval
    builder
      .addCase(submitDutyScheduleForApproval.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        submitDutyScheduleForApproval.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.successMessage = payload.message;
        }
      )
      .addCase(submitDutyScheduleForApproval.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      });

    // Handle directorApproval
    builder
      .addCase(directorApproval.pending, (state) => {
        state.loading = true;
      })
      .addCase(directorApproval.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      })
      .addCase(directorApproval.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      });

    // Handle HR Approval
    builder
      .addCase(hrApproval.pending, (state) => {
        state.loading = true;
      })
      .addCase(hrApproval.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      })
      .addCase(hrApproval.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      });
  },
});

export const { messageClear } = dutyScheduleSlice.actions;
export default dutyScheduleSlice.reducer;

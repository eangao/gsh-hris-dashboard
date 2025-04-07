import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchEmploymentStatus = createAsyncThunk(
  "employmentStatus/fetchEmploymentStatus",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/fetch-employment-status?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        {
          withCredentials: true,
        }
      );

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllEmploymentStatus = createAsyncThunk(
  "employmentStatus/fetchAllEmploymentStatus",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/fetch-all-employment-status", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createEmploymentStatus = createAsyncThunk(
  "employmentStatus/createEmploymentStatus",
  async (employmentStatusData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/create-employment-status",
        employmentStatusData,
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmploymentStatus = createAsyncThunk(
  "employmentStatus/updateEmploymentStatus",
  async (
    { _id, ...employmentStatusData },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.put(
        `/update-employment-status/${_id}`,
        employmentStatusData,
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

export const deleteEmploymentStatus = createAsyncThunk(
  "employmentStatus/deleteEmploymentStatus",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-employment-status/${id}`, {
        withCredentials: true,
      });

      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const employmentStatusSlice = createSlice({
  name: "employmentStatus",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    employmentStatuses: [],
    employmentStatus: "",
    totalEmploymentStatus: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch  Employment Status
    builder.addCase(fetchEmploymentStatus.fulfilled, (state, { payload }) => {
      state.totalEmploymentStatus = payload.totalEmploymentStatus;
      state.employmentStatuses = payload.employmentStatuses;
    });

    // Fetch All  Employment Status
    builder.addCase(
      fetchAllEmploymentStatus.fulfilled,
      (state, { payload }) => {
        state.employmentStatuses = payload.employmentStatuses;
      }
    );

    // Create EmploymentStatus
    builder
      .addCase(createEmploymentStatus.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createEmploymentStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createEmploymentStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update EmploymentStatus
    builder
      .addCase(updateEmploymentStatus.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateEmploymentStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateEmploymentStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Find and replace the updated EmploymentStatus
        state.employmentStatuses = state.employmentStatuses.map(
          (employmentStatus) =>
            employmentStatus._id === payload.employmentStatus._id
              ? payload.employmentStatus
              : employmentStatus
        );
      });

    // Delete EmploymentStatus
    builder
      .addCase(deleteEmploymentStatus.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteEmploymentStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteEmploymentStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted EmploymentStatus from the state
        state.employmentStatuses = state.employmentStatuses.filter(
          (employmentStatus) =>
            employmentStatus._id !== payload.employmentStatusId
        );
      });
  },
});

export const { messageClear } = employmentStatusSlice.actions;
export default employmentStatusSlice.reducer;

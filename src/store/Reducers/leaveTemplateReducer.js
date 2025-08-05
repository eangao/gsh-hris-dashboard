import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchLeaveTemplates = createAsyncThunk(
  "leaveTemplate/fetchLeaveTemplates",
  async (
    { perPage, page, searchValue, category, isActive, isMandatoryByLaw },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        searchValue: searchValue || "",
      });

      // Only add filter params if they have actual values (not empty strings)
      if (category && category !== "") params.append("category", category);
      if (isActive && isActive !== "") params.append("isActive", isActive);
      if (isMandatoryByLaw && isMandatoryByLaw !== "")
        params.append("isMandatoryByLaw", isMandatoryByLaw);

      const { data } = await api.get(
        `/hris/reference-data/leave-templates?${params.toString()}`,
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

export const fetchAllLeaveTemplates = createAsyncThunk(
  "leaveTemplate/fetchAllLeaveTemplates",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        "/hris/reference-data/leave-templates/options",
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

export const createLeaveTemplate = createAsyncThunk(
  "leaveTemplate/createLeaveTemplate",
  async (leaveTemplateData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/hris/reference-data/leave-templates",
        leaveTemplateData,
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

export const updateLeaveTemplate = createAsyncThunk(
  "leaveTemplate/updateLeaveTemplate",
  async (
    { _id, ...leaveTemplateData },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.put(
        `/hris/reference-data/leave-templates/${_id}`,
        leaveTemplateData,
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

export const deleteLeaveTemplate = createAsyncThunk(
  "leaveTemplate/deleteLeaveTemplate",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/hris/reference-data/leave-templates/${id}`,
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

export const toggleLeaveTemplateStatus = createAsyncThunk(
  "leaveTemplate/toggleLeaveTemplateStatus",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/hris/reference-data/leave-templates/${id}/toggle-status`,
        {},
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

const leaveTemplateSlice = createSlice({
  name: "leaveTemplate",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    leaveTemplates: [],
    leaveTemplate: null,
    totalLeaveTemplates: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    clearState: (state) => {
      state.loading = false;
      state.successMessage = "";
      state.errorMessage = "";
      state.leaveTemplates = [];
      state.leaveTemplate = null;
      state.totalLeaveTemplates = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leave Templates
    builder.addCase(fetchLeaveTemplates.fulfilled, (state, { payload }) => {
      state.totalLeaveTemplates = payload.totalLeaveTemplates;
      state.leaveTemplates = payload.leaveTemplates;
    });

    // Fetch All Leave Templates
    builder.addCase(fetchAllLeaveTemplates.fulfilled, (state, { payload }) => {
      state.leaveTemplates = payload.leaveTemplates;
    });

    // Create Leave Template
    builder
      .addCase(createLeaveTemplate.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createLeaveTemplate.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createLeaveTemplate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update Leave Template
    builder
      .addCase(updateLeaveTemplate.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateLeaveTemplate.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateLeaveTemplate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete Leave Template
    builder
      .addCase(deleteLeaveTemplate.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteLeaveTemplate.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteLeaveTemplate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted leave template from the state
        state.leaveTemplates = state.leaveTemplates.filter(
          (template) => template._id !== payload.leaveTemplateId
        );
      });

    // Toggle Leave Template Status
    builder
      .addCase(toggleLeaveTemplateStatus.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(toggleLeaveTemplateStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(toggleLeaveTemplateStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });
  },
});

export const { messageClear, clearState } = leaveTemplateSlice.actions;
export default leaveTemplateSlice.reducer;

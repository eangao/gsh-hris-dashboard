import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchShiftTemplates = createAsyncThunk(
  "shiftTemplate/fetchShiftTemplates",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/reference-data/shift-templates?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const fetchAllShiftTemplates = createAsyncThunk(
  "shiftTemplate/fetchAllShiftTemplates",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        "/hris/reference-data/shift-templates/options",
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

export const createShiftTemplate = createAsyncThunk(
  "shiftTemplate/createShiftTemplate = createAsyncThunk(",
  async (scheduleData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/hris/reference-data/shift-templates",
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

export const updateShiftTemplate = createAsyncThunk(
  "shiftTemplate/updateShiftTemplate",
  async ({ _id, ...scheduleData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/reference-data/shift-templates/${_id}`,
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

export const deleteShiftTemplate = createAsyncThunk(
  "shiftTemplate/deleteShiftTemplate",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/hris/reference-data/shift-templates/${id}`,
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

const shiftTemplateSlice = createSlice({
  name: "shiftTemplate",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    shiftTemplates: [],
    shiftTemplate: "",
    totalShiftTemplate: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch shiftTemplates
    builder.addCase(fetchShiftTemplates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.totalShiftTemplate = payload.totalShiftTemplate;
      state.shiftTemplates = payload.shiftTemplates;
    });

    builder.addCase(fetchAllShiftTemplates.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.shiftTemplates = payload.shiftTemplates;
    });

    // Create shiftTemplates
    builder
      .addCase(createShiftTemplate.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createShiftTemplate.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createShiftTemplate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update shiftTemplates
    builder
      .addCase(updateShiftTemplate.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateShiftTemplate.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateShiftTemplate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete shiftTemplates
    builder
      .addCase(deleteShiftTemplate.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteShiftTemplate.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteShiftTemplate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted shiftTemplates from the state
        state.shiftTemplates = state.shiftTemplates.filter(
          (shiftTemplate) => shiftTemplate._id !== payload.shiftTemplateId
        );
      });
  },
});

export const { messageClear } = shiftTemplateSlice.actions;
export default shiftTemplateSlice.reducer;

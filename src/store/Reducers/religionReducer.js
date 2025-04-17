import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchReligions = createAsyncThunk(
  "religion/fetchReligions",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/fetch-religions?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const fetchAllReligions = createAsyncThunk(
  "religion/fetchAllReligions",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/fetch-all-religions", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createReligion = createAsyncThunk(
  "religion/createReligion",
  async (religionData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/create-religion", religionData, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReligion = createAsyncThunk(
  "religion/updateReligion",
  async ({ _id, ...religionData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/update-religion/${_id}`, religionData, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReligion = createAsyncThunk(
  "religion/deleteReligion",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-religion/${id}`, {
        withCredentials: true,
      });

      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const religionSlice = createSlice({
  name: "religion",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    religions: [],
    religion: "",
    totalReligion: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch Religions
    builder.addCase(fetchReligions.fulfilled, (state, { payload }) => {
      state.totalReligion = payload.totalReligion;
      state.religions = payload.religions;
    });

    // Fetch All Religions
    builder.addCase(fetchAllReligions.fulfilled, (state, { payload }) => {
      state.religions = payload.religions;
    });

    // Create Religion
    builder
      .addCase(createReligion.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createReligion.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createReligion.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update Religion
    builder
      .addCase(updateReligion.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateReligion.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateReligion.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete Religion
    builder
      .addCase(deleteReligion.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteReligion.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteReligion.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted religion from the state
        state.religions = state.religions.filter(
          (religion) => religion._id !== payload.religionId
        );
      });
  },
});

export const { messageClear } = religionSlice.actions;
export default religionSlice.reducer;

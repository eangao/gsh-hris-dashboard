import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchPositions = createAsyncThunk(
  "position/fetchPositions",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/reference-data/positions?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const fetchAllPositions = createAsyncThunk(
  "position/fetchAllPositions",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/reference-data/positions/options", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createPosition = createAsyncThunk(
  "position/createPosition",
  async (positionData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/hris/reference-data/positions",
        positionData,
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

export const updatePosition = createAsyncThunk(
  "position/updatePosition",
  async ({ _id, ...positionData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/reference-data/positions/${_id}`,
        positionData,
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

export const deletePosition = createAsyncThunk(
  "position/deletePosition",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/hris/reference-data/positions/${id}`,
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

const positionSlice = createSlice({
  name: "position",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    positions: [],
    position: "",
    totalPosition: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch Positions
    builder.addCase(fetchPositions.fulfilled, (state, { payload }) => {
      state.totalPosition = payload.totalPosition;
      state.positions = payload.positions;
    });

    // Fetch All Positions
    builder.addCase(fetchAllPositions.fulfilled, (state, { payload }) => {
      state.positions = payload.positions;
    });

    // Create Position
    builder
      .addCase(createPosition.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createPosition.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createPosition.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update Position
    builder
      .addCase(updatePosition.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updatePosition.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updatePosition.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete Position
    builder
      .addCase(deletePosition.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deletePosition.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deletePosition.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted position from the state
        state.positions = state.positions.filter(
          (position) => position._id !== payload.positionId
        );
      });
  },
});

export const { messageClear } = positionSlice.actions;
export default positionSlice.reducer;

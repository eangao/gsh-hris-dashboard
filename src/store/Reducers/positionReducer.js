import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchPositions = createAsyncThunk(
  "position/fetchPositions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/position");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPosition = createAsyncThunk(
  "position/createPosition",
  async (positionData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/position", positionData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePosition = createAsyncThunk(
  "position/updatePosition",
  async ({ id, positionData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/position/${id}`, positionData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePosition = createAsyncThunk(
  "position/deletePosition",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/position/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const positionSlice = createSlice({
  name: "position",
  initialState: {
    positions: [], // Initialize as empty array
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
  },
  extraReducers: (builder) => {
    // Fetch Positions
    builder.addCase(fetchPositions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPositions.fulfilled, (state, action) => {
      state.loading = false;
      state.positions = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchPositions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Create Position
    builder.addCase(createPosition.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPosition.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Position created successfully";
      state.positions = [...state.positions, action.payload];
    });
    builder.addCase(createPosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Update Position
    builder.addCase(updatePosition.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePosition.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Position updated successfully";
      state.positions = state.positions.map((position) =>
        position.id === action.payload.id ? action.payload : position
      );
    });
    builder.addCase(updatePosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Delete Position
    builder.addCase(deletePosition.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePosition.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Position deleted successfully";
      state.positions = state.positions.filter(
        (position) => position.id !== action.payload.id
      );
    });
    builder.addCase(deletePosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

export const { messageClear } = positionSlice.actions;
export default positionSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunks for API calls
export const fetchHolidays = createAsyncThunk(
  "holidays/fetchHolidays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/holidays");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHoliday = createAsyncThunk(
  "holidays/createHoliday",
  async (holidayData, { rejectWithValue }) => {
    try {
      const response = await api.post("/holidays", holidayData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateHoliday = createAsyncThunk(
  "holidays/updateHoliday",
  async ({ id, holidayData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/holidays/${id}`, holidayData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHoliday = createAsyncThunk(
  "holidays/deleteHoliday",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/holidays/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const holidaySlice = createSlice({
  name: "holidays",
  initialState: {
    holidays: [],
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
    clearState: (state) => {
      state.holidays = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch holidays
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Create holiday
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Holiday created successfully";
        state.holidays.push(action.payload);
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Update holiday
      .addCase(updateHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Holiday updated successfully";
        const index = state.holidays.findIndex(
          (holiday) => holiday.id === action.payload.id
        );
        if (index !== -1) {
          state.holidays[index] = action.payload;
        }
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Delete holiday
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Holiday deleted successfully";
        state.holidays = state.holidays.filter(
          (holiday) => holiday.id !== action.payload
        );
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { messageClear, clearState } = holidaySlice.actions;
export default holidaySlice.reducer;

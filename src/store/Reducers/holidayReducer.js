import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchHolidays = createAsyncThunk(
  "holiday/fetchHolidays",
  async (
    { perPage, page, searchValue, type, scope, status, year },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        searchValue: searchValue || "",
      });

      if (type) params.append("type", type);
      if (scope) params.append("scope", scope);
      if (status) params.append("status", status);
      if (year) params.append("year", year);

      const { data } = await api.get(
        `/hris/reference-data/holidays?${params.toString()}`,
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

export const fetchAllHolidays = createAsyncThunk(
  "holiday/fetchAllHolidays",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/reference-data/holidays/options", {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHoliday = createAsyncThunk(
  "holiday/createHoliday",
  async (holidayData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/hris/reference-data/holidays",
        holidayData,
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

export const updateHoliday = createAsyncThunk(
  "holiday/updateHoliday",
  async ({ _id, ...holidayData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/reference-data/holidays/${_id}`,
        holidayData,
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

export const deleteHoliday = createAsyncThunk(
  "holiday/deleteHoliday",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/hris/reference-data/holidays/${id}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchHolidaysDateRange = createAsyncThunk(
  "holiday/fetchHolidaysDateRange",
  async ({ startDate, endDate }, { rejectWithValue, fulfillWithValue }) => {
    try {
      if (!startDate || !endDate) {
        return rejectWithValue({
          error: "startDate and endDate are required",
        });
      }

      const params = new URLSearchParams({
        startDate: startDate,
        endDate: endDate,
      });

      const { data } = await api.get(
        `/hris/reference-data/holidays/date-range?${params.toString()}`,
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

const holidaySlice = createSlice({
  name: "holiday",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    holidays: [],
    holiday: null,
    totalHoliday: 0,
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
      state.holidays = [];
      state.holiday = null;
      state.totalHoliday = 0;
      state.locationHolidays = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Holidays
    builder.addCase(fetchHolidays.fulfilled, (state, { payload }) => {
      state.totalHoliday = payload.totalHolidays;
      state.holidays = payload.holidays;
    });

    // Fetch All Holidays
    builder.addCase(fetchAllHolidays.fulfilled, (state, { payload }) => {
      state.holidays = payload.holidays;
    });

    // Create Holiday
    builder
      .addCase(createHoliday.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createHoliday.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createHoliday.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update Holiday
    builder
      .addCase(updateHoliday.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateHoliday.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateHoliday.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete Holiday
    builder
      .addCase(deleteHoliday.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteHoliday.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteHoliday.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted holiday from the state
        state.holidays = state.holidays.filter(
          (holiday) => holiday._id !== payload.holidayId
        );
      });

    // Fetch Holidays For Location
    builder
      .addCase(fetchHolidaysDateRange.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHolidaysDateRange.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(fetchHolidaysDateRange.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.holidays = payload.holidays;
      });
  },
});

export const { messageClear, clearState } = holidaySlice.actions;
export default holidaySlice.reducer;

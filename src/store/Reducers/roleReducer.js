import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/fetch-roles?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const createRole = createAsyncThunk(
  "role/createRole",
  async (roleData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/create-role", roleData, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async ({ _id, ...roleData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/update-role/${_id}`, roleData, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-role/${id}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    roles: [],
    role: "",
    totalRole: 0,
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
      state.roles = [];
      state.role = "";
      state.totalRole = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Roles
    builder.addCase(fetchRoles.fulfilled, (state, { payload }) => {
      state.totalRole = payload.totalRole;
      state.roles = payload.roles;
    });

    // Create Roles
    builder
      .addCase(createRole.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createRole.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createRole.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.roles = [...state.roles, payload.role];
      });

    // Update Roles
    builder
      .addCase(updateRole.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateRole.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateRole.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Find and replace the updated role
        state.roles = state.roles.map((role) =>
          role._id === payload.role._id ? payload.role : role
        );
      });

    // Delete Roles
    builder
      .addCase(deleteRole.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteRole.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted role from the state
        state.roles = state.roles.filter((role) => role._id !== payload.id);
      });
  },
});

export const { messageClear, clearState } = roleSlice.actions;
export default roleSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/fetch-departments?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        { withCredentials: true }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (departmentData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/create-department", departmentData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async ({ _id, ...departmentData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/update-department/${_id}`,
        departmentData,
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

export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-department/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    departments: [],
    department: "",
    totalDepartment: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDepartments.fulfilled, (state, { payload }) => {
      state.totalDepartment = payload.totalDepartment;
      state.departments = payload.departments;
    });

    builder
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepartment.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createDepartment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.departments = [...state.departments, payload.department];
      });

    builder
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartment.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateDepartment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        state.departments = state.departments.map((department) =>
          department._id === payload.department._id
            ? payload.department
            : department
        );
      });

    builder
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartment.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })

      .addCase(deleteDepartment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.departments = state.departments.filter(
          (department) => department._id !== payload.departmentId
        );
      });
  },
});

export const { messageClear } = departmentSlice.actions;
export default departmentSlice.reducer;

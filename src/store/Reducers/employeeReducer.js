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

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const fetchAllDepartments = createAsyncThunk(
//   "department/fetchAllDepartments",
//   async (_, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.get("/fetch-all-departments", {
//         withCredentials: true,
//       });

//       // console.log(data);

//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/create-employee", employeeData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const updateDepartment = createAsyncThunk(
//   "department/updateDepartment",
//   async ({ _id, ...departmentData }, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.put(
//         `/update-department/${_id}`,
//         departmentData,
//         {
//           withCredentials: true,
//         }
//       );

//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const deleteDepartment = createAsyncThunk(
//   "department/deleteDepartment",
//   async (id, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.delete(`/delete-department/${id}`, {
//         withCredentials: true,
//       });
//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    employees: [],
    employee: "",
    totalEmployee: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchDepartments.fulfilled, (state, { payload }) => {
    //   state.totalDepartment = payload.totalDepartment;
    //   state.departments = payload.departments;
    // });
    // // Fetch All Clusters
    // builder.addCase(fetchAllDepartments.fulfilled, (state, { payload }) => {
    //   state.departments = payload.departments;
    // });
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createEmployee.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.employees = [...state.employees, payload.employee];
      });
    // builder;
    //   .addCase(updateDepartment.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(updateDepartment.rejected, (state, { payload }) => {
    //     state.loading = false;
    //     state.errorMessage = payload.error;
    //   })
    //   .addCase(updateDepartment.fulfilled, (state, { payload }) => {
    //     state.loading = false;
    //     state.successMessage = payload.message;
    //     state.departments = state.departments.map((department) =>
    //       department._id === payload.department._id
    //         ? payload.department
    //         : department
    //     );
    //   });
    // builder
    //   .addCase(deleteDepartment.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(deleteDepartment.rejected, (state, { payload }) => {
    //     state.loading = false;
    //     state.errorMessage = payload.error;
    //   })
    //   .addCase(deleteDepartment.fulfilled, (state, { payload }) => {
    //     state.loading = false;
    //     state.successMessage = payload.message;
    //     state.departments = state.departments.filter(
    //       (department) => department._id !== payload.departmentId
    //     );
    //   });
  },
});

export const { messageClear } = employeeSlice.actions;
export default employeeSlice.reducer;

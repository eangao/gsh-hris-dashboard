import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/employees?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        { withCredentials: true }
      );

      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  "employee/fetchAllEmployees",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/employees/options", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEmployeesManagers = createAsyncThunk(
  "employee/fetchEmployeesManagers",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/employees/managers", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEmployeesDirectors = createAsyncThunk(
  "employee/fetchEmployeesDirectors",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/employees/directors", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//for edit
export const fetchEmployeeById = createAsyncThunk(
  "employee/fetchEmployeeById",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/hris/employees/${id}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEmployeeDetailsById = createAsyncThunk(
  "employee/fetchEmployeeDetailsById",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/hris/employees/${id}/details`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/hris/employees", employeeData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (
    { employeeId, employeeData },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.put(
        `/hris/employees/${employeeId}`,
        employeeData,
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

export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/hris/employees/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchManagedDepartments = createAsyncThunk(
  "employee/fetchManagedDepartments",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/hris/employees/${id}/managed-departments`,
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

// Fetch employees by department ID (suggested name: fetchEmployeesByDepartment)
export const fetchEmployeesByDepartment = createAsyncThunk(
  "employee/fetchEmployeesByDepartment",
  async (departmentId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/hris/employees/department/${departmentId}`,
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

// Fetch managed cluster for directors
export const fetchManagedCluster = createAsyncThunk(
  "employee/fetchManagedCluster",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/hris/employees/${id}/managed-cluster`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    employees: [],
    employee: "",
    managers: [],
    directors: [],
    totalEmployee: 0,
    managedDepartments: [], // <-- add this
    managedCluster: null, // <-- add this for directors
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      state.totalEmployee = payload.totalEmployee;
      state.employees = payload.employees;
      state.loading = false;
    });

    builder.addCase(fetchEmployees.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchEmployeeById.fulfilled, (state, { payload }) => {
      state.employee = payload.employee;
      state.loading = false;
    });

    builder.addCase(
      fetchEmployeeDetailsById.fulfilled,
      (state, { payload }) => {
        state.employee = payload.employee;
        state.loading = false;
      }
    );

    //  Fetch All Employees
    builder.addCase(fetchAllEmployees.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchAllEmployees.fulfilled, (state, { payload }) => {
      state.employees = payload.employees;
      state.loading = false;
    });

    //  Fetch All Managers
    builder.addCase(fetchEmployeesManagers.fulfilled, (state, { payload }) => {
      state.managers = payload.managers;
      state.loading = false;
    });

    builder.addCase(fetchEmployeesManagers.pending, (state) => {
      state.loading = true;
    });

    //  Fetch All Director
    builder.addCase(fetchEmployeesDirectors.fulfilled, (state, { payload }) => {
      state.directors = payload.directors;
    });

    builder.addCase(fetchEmployeesDirectors.pending, (state) => {
      state.loading = true;
    });

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
        state.employees = [...state.employees, payload.employee].sort((a, b) =>
          a.personalInformation.lastName.localeCompare(
            b.personalInformation.lastName
          )
        );
        state.totalEmployee = state.totalEmployee + 1;
      });

    builder
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateEmployee.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteEmployee.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
        state.employees = state.employees.filter(
          (employee) => employee._id !== payload.employeeId
        );
      });
    builder.addCase(fetchManagedDepartments.fulfilled, (state, { payload }) => {
      state.managedDepartments = payload.managedDepartments;
      state.loading = false;
    });
    builder.addCase(fetchManagedDepartments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchManagedDepartments.rejected, (state, { payload }) => {
      state.loading = false;
      state.errorMessage =
        payload?.error || "Failed to fetch managed departments";
    });

    // Fetch Employees By Department
    builder.addCase(fetchEmployeesByDepartment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchEmployeesByDepartment.fulfilled,
      (state, { payload }) => {
        state.employees = payload.employees;
        state.loading = false;
      }
    );
    builder.addCase(
      fetchEmployeesByDepartment.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.errorMessage =
          payload?.error || "Failed to fetch employees by department";
      }
    );
    // Handle fetchManagedCluster
    builder.addCase(fetchManagedCluster.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchManagedCluster.fulfilled, (state, { payload }) => {
      state.managedCluster = payload.managedCluster;
      state.loading = false;
    });
    builder.addCase(fetchManagedCluster.rejected, (state, { payload }) => {
      state.loading = false;
      state.errorMessage = payload?.error || "Failed to fetch managed cluster";
    });
  },
});

export const { messageClear } = employeeSlice.actions;
export default employeeSlice.reducer;

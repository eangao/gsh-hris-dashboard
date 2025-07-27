import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (
    { perPage, page, searchValue, departmentId = null },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/employees/getPaginated?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}&&departmentId=${departmentId}`,

        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunks
export const fetchEmployeesByCluster = createAsyncThunk(
  "employee/fetchEmployeesByCluster",
  async (
    { perPage, page, searchValue, clusterId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/employees/getPaginatedByCluster?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}&&clusterId=${clusterId}`,

        { withCredentials: true }
      );

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

// Fetch all employees birthdays for HR dashboard
export const fetchEmployeesBirthdays = createAsyncThunk(
  "employee/fetchEmployeesBirthdays",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/employees/birthdays", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all employees birthdays by cluster for Director dashboard
export const fetchEmployeesBirthdaysByCluster = createAsyncThunk(
  "employee/fetchEmployeesBirthdaysByCluster",
  async (clusterId, { rejectWithValue, fulfillWithValue }) => {
    console.log(clusterId);
    try {
      const { data } = await api.get(
        `/hris/employees/birthdays/by-cluster/${clusterId}`,
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

// Fetch all employees birthdays by departments for Manager dashboard
export const fetchEmployeesBirthdaysByDepartments = createAsyncThunk(
  "employee/fetchEmployeesBirthdaysByDepartments",
  async (departments, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/hris/employees/birthdays/by-departments`,
        { departments },
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

export const fetchEmployeeDepartmentId = createAsyncThunk(
  "employee/fetchEmployeeDepartmentId ",
  async (employeeId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/hris/employees/${employeeId}/department`,
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
    statusCounts: {}, // Add statusCounts to initial state
    managedDepartments: [], // <-- add this
    managedCluster: null, // <-- add this for directors
    birthdayEmployees: [], // <-- add this for birthday data
    birthdayLoading: false, // <-- add separate loading for birthdays
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    clearEmployeeData: (state) => {
      state.employees = [];
      state.employee = null;
      state.managers = [];
      state.directors = [];
      state.totalEmployee = 0;
      state.statusCounts = {};
      state.managedDepartments = [];
      state.managedCluster = null;
      state.errorMessage = "";
      state.successMessage = "";
      state.loading = false;
    },
    clearState: (state) => {
      state.loading = false;
      state.successMessage = "";
      state.errorMessage = "";
      state.employees = [];
      state.employee = "";
      state.managers = [];
      state.directors = [];
      state.totalEmployee = 0;
      state.statusCounts = {};
      state.managedDepartments = [];
      state.managedCluster = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      state.totalEmployee = payload.totalEmployee;
      state.employees = payload.employees;
      state.statusCounts = payload.statusCounts || {}; // Store statusCounts from backend
      state.loading = false;
    });

    builder.addCase(fetchEmployees.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchEmployeesByCluster.fulfilled, (state, { payload }) => {
      state.totalEmployee = payload.totalEmployee;
      state.employees = payload.employees;
      state.statusCounts = payload.statusCounts || {}; // Store statusCounts from backend
      state.loading = false;
    });

    builder.addCase(fetchEmployeesByCluster.pending, (state) => {
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

    // Handle fetchEmployeeDepartmentById
    builder
      .addCase(fetchEmployeeDepartmentId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeDepartmentId.fulfilled, (state, { payload }) => {
        state.employee = payload.employee;
        state.loading = false;
      })
      .addCase(fetchEmployeeDepartmentId.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.error;
      });

    // Handle fetchEmployeesBirthdays
    builder.addCase(fetchEmployeesBirthdays.pending, (state) => {
      state.birthdayLoading = true;
    });
    builder.addCase(fetchEmployeesBirthdays.fulfilled, (state, { payload }) => {
      state.birthdayEmployees = payload.employees;
      state.birthdayLoading = false;
    });
    builder.addCase(fetchEmployeesBirthdays.rejected, (state, { payload }) => {
      state.birthdayLoading = false;
      state.errorMessage =
        payload?.error || "Failed to fetch employee birthdays";
    });

    // Handle fetchEmployeesBirthdaysByCluster
    builder.addCase(fetchEmployeesBirthdaysByCluster.pending, (state) => {
      state.birthdayLoading = true;
    });
    builder.addCase(
      fetchEmployeesBirthdaysByCluster.fulfilled,
      (state, { payload }) => {
        state.birthdayEmployees = payload.employees;
        state.birthdayLoading = false;
      }
    );
    builder.addCase(
      fetchEmployeesBirthdaysByCluster.rejected,
      (state, { payload }) => {
        state.birthdayLoading = false;
        state.errorMessage =
          payload?.error || "Failed to fetch employee birthdays";
      }
    );

    // Handle fetchEmployeesBirthdaysByDepartments
    builder.addCase(fetchEmployeesBirthdaysByDepartments.pending, (state) => {
      state.birthdayLoading = true;
    });
    builder.addCase(
      fetchEmployeesBirthdaysByDepartments.fulfilled,
      (state, { payload }) => {
        state.birthdayEmployees = payload.employees;
        state.birthdayLoading = false;
      }
    );
    builder.addCase(
      fetchEmployeesBirthdaysByDepartments.rejected,
      (state, { payload }) => {
        state.birthdayLoading = false;
        state.errorMessage =
          payload?.error || "Failed to fetch employee birthdays";
      }
    );
  },
});

export const { messageClear, clearEmployeeData } = employeeSlice.actions;
export default employeeSlice.reducer;

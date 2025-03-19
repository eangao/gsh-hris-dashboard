import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  loading: false,
  error: null,
  success: false,
  message: "",
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = "";
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.message = "";
    },
    setSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = action.payload;
    },
    messageClear: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },
    setEmployees: (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    updateEmployeeState: (state, action) => {
      const index = state.employees.findIndex(
        (emp) => emp.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  messageClear,
  setEmployees,
  addEmployee,
  updateEmployeeState,
  removeEmployee,
} = employeeSlice.actions;

// Async thunk actions
export const fetchEmployees = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    // Temporary mock data until API is ready
    const mockData = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 Main St",
        gender: "Male",
        birthdate: "1990-01-01",
        salary: "50000",
        dateHired: "2023-01-01",
        departmentId: 1,
        positionId: 1,
        status: "Active",
        workScheduleId: 1,
      },
    ];
    dispatch(setEmployees(mockData));
  } catch (error) {
    dispatch(
      setError("An error occurred while fetching employees. Please try again.")
    );
  }
};

export const createEmployee = (employeeData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    // Temporary mock response until API is ready
    const mockResponse = {
      ...employeeData,
      id: Date.now(), // Generate a temporary ID
    };
    dispatch(addEmployee(mockResponse));
    dispatch(setSuccess("Employee created successfully"));
  } catch (error) {
    dispatch(
      setError("An error occurred while creating employee. Please try again.")
    );
  }
};

export const updateEmployee =
  ({ id, employeeData }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading());
      // Temporary mock update until API is ready
      const mockResponse = {
        ...employeeData,
        id,
      };
      dispatch(updateEmployeeState(mockResponse));
      dispatch(setSuccess("Employee updated successfully"));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    // Temporary mock delete until API is ready
    dispatch(removeEmployee(id));
    dispatch(setSuccess("Employee deleted successfully"));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default employeeSlice.reducer;

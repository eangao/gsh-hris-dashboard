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
        (emp) => emp._id === action.payload._id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp._id !== action.payload
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
        _id: "1",
        personalInformation: {
          employeeId: 1001,
          lastName: "Doe",
          firstName: "John",
          middleName: "",
          birthdate: "1990-01-01",
          gender: "Male",
          civilStatus: "Single",
          religionId: "1",
        },
        contactInformation: {
          addresses: {
            temporaryAddress: "123 Temp St",
            permanentAddress: "456 Perm St",
          },
          phoneNumber: "1234567890",
          email: "john@example.com",
        },
        employmentInformation: {
          departmentId: "1",
          positionId: "1",
          employmentStatusId: "1",
          dateStarted: "2023-01-01",
        },
        governmentInformation: {
          sssNumber: "SSS123",
          philhealthNumber: "PH123",
          pagibigNumber: "PAG123",
          tin: "TIN123",
        },
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
      _id: Date.now().toString(), // Generate a temporary ID
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
        _id: id,
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

// Section-specific update actions
export const updatePersonalInfo =
  ({ id, personalInfo }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading());
      const { employees } = getState().employee;
      const employee = employees.find((emp) => emp._id === id);
      if (!employee) throw new Error("Employee not found");

      const updatedEmployee = {
        ...employee,
        personalInformation: {
          ...employee.personalInformation,
          ...personalInfo,
        },
      };

      dispatch(updateEmployeeState(updatedEmployee));
      dispatch(setSuccess("Personal information updated successfully"));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export const updateContactInfo =
  ({ id, contactInfo }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading());
      const { employees } = getState().employee;
      const employee = employees.find((emp) => emp._id === id);
      if (!employee) throw new Error("Employee not found");

      const updatedEmployee = {
        ...employee,
        contactInformation: {
          ...employee.contactInformation,
          ...contactInfo,
        },
      };

      dispatch(updateEmployeeState(updatedEmployee));
      dispatch(setSuccess("Contact information updated successfully"));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export const updateEmploymentInfo =
  ({ id, employmentInfo }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading());
      const { employees } = getState().employee;
      const employee = employees.find((emp) => emp._id === id);
      if (!employee) throw new Error("Employee not found");

      const updatedEmployee = {
        ...employee,
        employmentInformation: {
          ...employee.employmentInformation,
          ...employmentInfo,
        },
      };

      dispatch(updateEmployeeState(updatedEmployee));
      dispatch(setSuccess("Employment information updated successfully"));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export const updateGovernmentInfo =
  ({ id, governmentInfo }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading());
      const { employees } = getState().employee;
      const employee = employees.find((emp) => emp._id === id);
      if (!employee) throw new Error("Employee not found");

      const updatedEmployee = {
        ...employee,
        governmentInformation: {
          ...employee.governmentInformation,
          ...governmentInfo,
        },
      };

      dispatch(updateEmployeeState(updatedEmployee));
      dispatch(setSuccess("Government information updated successfully"));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export default employeeSlice.reducer;

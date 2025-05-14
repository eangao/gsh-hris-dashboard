import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", info, {
        withCredentials: true,
      });

      localStorage.setItem("accessToken", data.token);

      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const user_login = createAsyncThunk(
  "auth/user_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/user-login", info, {
        withCredentials: true,
      });

      localStorage.setItem("accessToken", data.token);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/fetch-users?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUnregisteredUsers = createAsyncThunk(
  "auth/getUnregisteredUsers",
  async ({ searchUnregisteredUser }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/get-unregistered-users?searchUnregisteredUser=${searchUnregisteredUser}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//for edit
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/fetch-user/${_id}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/create-user", userData, {
        withCredentials: true,
      });

      //  console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (newPassword, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/change-password", newPassword, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ _id, ...userData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/update-user/${_id}`, userData, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/user-logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("accessToken");

      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

const returnRole = (token) => {
  if (token) {
    const decodeToken = jwtDecode(token);
    const expireTime = new Date(decodeToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodeToken.role;
    }
  } else {
    return "";
  }
};

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loading: false,
    userInfo: "",
    role: returnRole(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
    users: [],
    user: "",
    totalUser: 0,
    unRegisteredUsers: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    clearUnRegisteredUsers: (state, _) => {
      state.unRegisteredUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
        state.user = payload.user;
      })
      // User Login
      .addCase(user_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(user_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(user_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
        state.user = payload.user;
      })

      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.totalUser = payload.totalUser;
        state.users = payload.users;
      })

      //
      .addCase(createUser.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(createUser.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })

      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })

      .addCase(getUnregisteredUsers.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.unRegisteredUsers = payload.unRegisteredUsers;
      })

      .addCase(changePassword.pending, (state) => {
        state.loader = true;
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })

      .addCase(changePassword.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.successMessage = payload.message;
      })

      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
      })

      .addCase(logout.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.role = ""; // Reset user role
        state.token = "";
        state.userInfo = "";
      });
  },
});

export const { messageClear, clearUnRegisteredUsers } = authReducer.actions;
export default authReducer.reducer;

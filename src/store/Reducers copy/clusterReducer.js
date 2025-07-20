import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks
export const fetchClusters = createAsyncThunk(
  "cluster/fetchClusters",
  async (
    { perPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/hris/reference-data/clusters?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const fetchAllClusters = createAsyncThunk(
  "cluster/fetchAllClusters",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/hris/reference-data/clusters/options", {
        withCredentials: true,
      });

      // console.log(data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCluster = createAsyncThunk(
  "cluster/createCluster",
  async (clusterData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/hris/reference-data/clusters",
        clusterData,
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

export const updateCluster = createAsyncThunk(
  "cluster/updateCluster",
  async ({ _id, ...clusterData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/reference-data/clusters/${_id}`,
        clusterData,
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

export const deleteCluster = createAsyncThunk(
  "cluster/deleteCluster",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/hris/reference-data/clusters/${id}`, {
        withCredentials: true,
      });

      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const assignClusterDirector = createAsyncThunk(
  "cluster/assignClusterDirector",
  async ({ _id, ...clusterData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/hris/reference-data/clusters/director/${_id}`,
        clusterData,
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

export const fetchClusterById = createAsyncThunk(
  "cluster/fetchClusterById",
  async (_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/hris/reference-data/clusters/${_id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const clusterSlice = createSlice({
  name: "cluster",
  initialState: {
    loading: false,
    successMessage: "",
    errorMessage: "",
    clusters: [],
    cluster: "",
    totalCluster: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch Clusters
    builder.addCase(fetchClusters.fulfilled, (state, { payload }) => {
      state.totalCluster = payload.totalCluster;
      state.clusters = payload.clusters;
    });

    // Fetch All Clusters
    builder.addCase(fetchAllClusters.fulfilled, (state, { payload }) => {
      state.clusters = payload.clusters;
    });

    // Create Cluster
    builder
      .addCase(createCluster.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(createCluster.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(createCluster.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Update Cluster
    builder
      .addCase(updateCluster.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(updateCluster.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(updateCluster.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Assign Cluster Director
    builder
      .addCase(assignClusterDirector.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignClusterDirector.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(assignClusterDirector.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      });

    // Delete Cluster
    builder
      .addCase(deleteCluster.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteCluster.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload.error;
      })
      .addCase(deleteCluster.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;

        // Remove the deleted cluster from the state
        state.clusters = state.clusters.filter(
          (cluster) => cluster._id !== payload.clusterId
        );
      });

    // Fetch Cluster By Id
    builder.addCase(fetchClusterById.fulfilled, (state, { payload }) => {
      state.cluster = payload.cluster;
    });
  },
});

export const { messageClear } = clusterSlice.actions;
export default clusterSlice.reducer;

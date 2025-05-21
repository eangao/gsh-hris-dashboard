import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClusters,
  createCluster,
  updateCluster,
  deleteCluster,
  messageClear,
} from "../../store/Reducers/clusterReducer";
import { fetchEmployeesDirectors } from "../../store/Reducers/employeeReducer";

import Pagination from "../../components/Pagination";
import Search from "../../components/Search";

import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import { buttonOverrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";

const Cluster = () => {
  const dispatch = useDispatch();

  const { clusters, totalCluster, loading, successMessage, errorMessage } =
    useSelector((state) => state.cluster);

  const { directors } = useSelector((state) => state.employee);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchClusters(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  const getClusters = () => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchClusters(obj));
  };

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    director: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      getClusters();

      setIsModalOpen(false);
      setDeleteId(null);

      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      dispatch(updateCluster(formData));
    } else {
      dispatch(createCluster(formData));
    }
  };

  const handleEdit = (cluster) => {
    setFormData(cluster);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteCluster(deleteId));
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      director: null,
    });
  };

  const getEmployeesDirectors = () => {
    dispatch(fetchEmployeesDirectors());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/*  Header and Add Cluster */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold  text-center">Cluster Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
            getEmployeesDirectors();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Add Cluster
        </button>
      </div>

      {/* Search and Add Cluster */}

      <div className=" mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search Cluster..."}
        />
      </div>

      {/* Clusters Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Cluster</th>
              <th className="p-3">Director</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="p-3 text-center">
                  loading...
                </td>
              </tr>
            ) : clusters?.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-3 text-center text-gray-500">
                  No clusters found.
                </td>
              </tr>
            ) : (
              clusters?.map((cluster) => (
                <tr key={cluster._id} className="border-t">
                  <td className="p-2  capitalize">
                    {cluster.name.toLowerCase()}
                  </td>
                  <td className="p-2  ">
                    {!cluster?.director ? (
                      "-"
                    ) : (
                      <>
                        <span className="capitalize">
                          {cluster?.director.personalInformation?.lastName},
                        </span>{" "}
                        <span className="capitalize">
                          {cluster?.director.personalInformation?.firstName}
                        </span>{" "}
                        {cluster?.director.personalInformation?.middleName && (
                          <span className="capitalize">
                            {cluster?.director.personalInformation?.middleName
                              .charAt(0)
                              .toUpperCase()}
                            .
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-2 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        handleEdit(cluster);
                        getEmployeesDirectors();
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteConfirm(cluster._id, cluster.name)
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination  */}
      {totalCluster <= perPage ? (
        ""
      ) : (
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalCluster}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalCluster / perPage))}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? "Edit Cluster" : "Add Cluster"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Cluster Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded capitalize"
                required
                disabled={loading}
              />

              <select
                name="director"
                value={formData.director?._id || formData.director} // handles both object or id
                onChange={(e) =>
                  setFormData({ ...formData, director: e.target.value })
                }
                className="w-full p-2 border rounded capitalize"
                // required
                disabled={loading}
              >
                <option value="">Assign Director</option>
                {directors.map((director) => {
                  const { firstName, middleName, lastName } =
                    director.personalInformation;

                  // Format: Lastname, Firstname M
                  const middleInitial = middleName
                    ? middleName.charAt(0).toUpperCase() + "."
                    : "";
                  const displayName =
                    `${lastName}, ${firstName} ${middleInitial}`.trim();

                  return (
                    <option key={director._id} value={director._id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`bg-gray-500 text-white px-4 py-2 rounded ${
                    loading ? "" : " hover:bg-gray-600"
                  }`}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading ? true : false}
                  className={`bg-blue-500 w-[100px] text-white px-4 py-2 rounded ${
                    loading ? "" : " hover:bg-blue-600"
                  } overflow-hidden`}
                >
                  {loading ? (
                    <PropagateLoader
                      color="#fff"
                      cssOverride={buttonOverrideStyle}
                    />
                  ) : formData._id ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>{`Are you sure you want to delete ${deleteName} cluster?`}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cluster;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  messageClear,
} from "../../store/Reducers/departmentReducer";
import { fetchAllClusters } from "../../store/Reducers/clusterReducer";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import { buttonOverrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import Search from "../components/Search";

const Department = () => {
  const dispatch = useDispatch();

  const {
    departments,
    totalDepartment,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.department);

  const { clusters } = useSelector((state) => state.cluster);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  useEffect(() => {
    // Reset to page 1 if searchValue is not empty
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }

    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchDepartments(obj));
    dispatch(fetchAllClusters());
  }, [searchValue, currentPage, perPage, dispatch]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    clusterId: "",
    changeReason: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
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
    console.log(formData._id);
    e.preventDefault();
    formData._id
      ? dispatch(updateDepartment(formData))
      : dispatch(createDepartment(formData));
  };

  const handleEdit = (department) => {
    setFormData(department);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteDepartment(deleteId));
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      clusterId: "",
      changeReason: "",
    });
  };

  const getAllClusters = () => {
    dispatch(fetchAllClusters());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">
          Department Management
        </h1>
        <button
          onClick={() => {
            getAllClusters();
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Add Department
        </button>
      </div>

      <div className="mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search Department..."
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Department Name</th>
              <th className="p-3">Cluster</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-3 text-center">
                  loading...
                </td>
              </tr>
            ) : departments?.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments?.map((dept) => (
                <tr key={dept._id} className="border-t">
                  <td className="p-2 text-lg capitalize">{dept.name}</td>
                  <td className="p-2 text-lg capitalize">
                    {clusters.find((c) => c._id === dept.clusterId)?.name ||
                      "N/A"}
                  </td>
                  <td className="p-2 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        getAllClusters();
                        handleEdit(dept);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(dept._id, dept.name)}
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

      {totalDepartment > perPage && (
        <div className="w-full flex justify-end mt-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalDepartment}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalDepartment / perPage))}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? "Edit Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Department Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded capitalize"
                required
                disabled={loading}
              />

              <select
                name="clusterId"
                value={formData.clusterId}
                onChange={(e) =>
                  setFormData({ ...formData, clusterId: e.target.value })
                }
                className="w-full p-2 border rounded capitalize"
                required
                disabled={loading}
              >
                <option value="">Select Cluster</option>
                {clusters.map((cluster) => (
                  <option key={cluster._id} value={cluster._id}>
                    {cluster.name}
                  </option>
                ))}
              </select>

              {formData._id && (
                <input
                  type="text"
                  name="changeReason"
                  placeholder="Update Reason"
                  value={formData.updateReason}
                  onChange={handleChange}
                  className="w-full p-2 border rounded capitalize"
                  required
                  disabled={loading}
                />
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
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
export default Department;

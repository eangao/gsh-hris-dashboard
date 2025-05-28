import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  assignDepartmentManager,
  deleteDepartment,
  messageClear,
} from "../../store/Reducers/departmentReducer";
import { fetchAllClusters } from "../../store/Reducers/clusterReducer";
import { fetchEmployeesManagers } from "../../store/Reducers/employeeReducer";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { GrUserAdd } from "react-icons/gr";

import { buttonOverrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";

const Department = () => {
  const dispatch = useDispatch();

  const {
    department,
    departments,
    totalDepartment,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.department);

  const { clusters } = useSelector((state) => state.cluster);
  const { managers } = useSelector((state) => state.employee);

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

    dispatch(fetchDepartments(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  const getDepartments = () => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchDepartments(obj));
  };

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    cluster: "",
    manager: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toAssignManager, setToAssignManager] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      getDepartments();

      setIsModalOpen(false);
      setDeleteId(null);

      setToAssignManager(false);

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
      // Editing an existing department
      if (toAssignManager) {
        const hasPreviousAssignedManger = dispatch(
          assignDepartmentManager(formData)
        );
      } else {
        dispatch(updateDepartment(formData));
      }
    } else {
      // Creating a new department
      dispatch(createDepartment(formData));
    }
  };

  //====edit============
  const handleEdit = (departmentId) => {
    setSelectedId(departmentId);

    getAllClusters();

    dispatch(fetchDepartmentById(departmentId));
  };

  useEffect(() => {
    if (department && department._id === selectedId) {
      setFormData(department);
      setIsModalOpen(true);
    }
  }, [department, selectedId]);
  //====edit============

  //====Asign manager============

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
      cluster: "",
      manager: null,
    });
  };

  const getAllClusters = () => {
    dispatch(fetchAllClusters());
  };

  const getEmployeesManagers = () => {
    dispatch(fetchEmployeesManagers());
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
              <th className="p-3">Department</th>
              <th className="p-3">Cluster</th>
              <th className="p-3">Manager</th>
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
                  <td className="p-2  capitalize">
                    {dept?.name?.toLowerCase()}
                  </td>
                  <td className="p-2 capitalize">
                    {dept?.cluster?.name?.toLowerCase()}
                  </td>

                  <td className="p-2  ">
                    {!dept?.manager ? (
                      "-"
                    ) : (
                      <>
                        <span className="capitalize">
                          {dept?.manager.personalInformation?.lastName},
                        </span>{" "}
                        <span className="capitalize">
                          {dept?.manager.personalInformation?.firstName}
                        </span>{" "}
                        {dept?.manager.personalInformation?.middleName && (
                          <span className="capitalize">
                            {dept?.manager.personalInformation?.middleName
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
                        getEmployeesManagers();
                        setToAssignManager(true);
                        handleEdit(dept._id);
                      }}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      disabled={loading}
                      title="Assign Manager"
                    >
                      <GrUserAdd />
                    </button>
                    {!dept?.isDefault && (
                      <>
                        <button
                          onClick={() => {
                            setToAssignManager(false);
                            handleEdit(dept._id);
                          }}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteConfirm(dept._id, dept.name)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          disabled={loading}
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    )}
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
              {formData._id
                ? toAssignManager
                  ? "Assign Manager"
                  : "Edit Department"
                : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Department Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded capitalize mt-1"
                  required={!toAssignManager}
                  disabled={toAssignManager}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cluster
                </label>
                <select
                  name="cluster"
                  value={formData.cluster._id}
                  onChange={(e) =>
                    setFormData({ ...formData, cluster: e.target.value })
                  }
                  className="w-full p-2 border rounded capitalize mt-1"
                  required={!toAssignManager}
                  disabled={toAssignManager}
                >
                  <option value="">Select Cluster</option>
                  {clusters.map((cluster) => (
                    <option key={cluster._id} value={cluster._id}>
                      {cluster.name}
                    </option>
                  ))}
                </select>
              </div>

              {toAssignManager && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign Manager
                  </label>
                  <select
                    name="manager"
                    value={formData.manager?._id || formData.manager} // handles both object or id
                    onChange={(e) =>
                      setFormData({ ...formData, manager: e.target.value })
                    }
                    className="w-full p-2 border rounded capitalize mt-1"
                    required={toAssignManager}
                    disabled={!toAssignManager}
                  >
                    <option value="">Assign Manager</option>
                    {managers.map((manager) => {
                      const { firstName, middleName, lastName } =
                        manager.personalInformation;

                      // Format: Lastname, Firstname M
                      const middleInitial = middleName
                        ? middleName.charAt(0).toUpperCase() + "."
                        : "";
                      const displayName =
                        `${lastName}, ${firstName} ${middleInitial}`.trim();

                      return (
                        <option key={manager._id} value={manager._id}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setToAssignManager(false);
                  }}
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
                    toAssignManager ? (
                      "Assign Manager"
                    ) : (
                      "Update"
                    )
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

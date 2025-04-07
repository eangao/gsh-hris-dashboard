import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPositions,
  createPosition,
  updatePosition,
  deletePosition,
  messageClear,
} from "../../store/Reducers/positionReducer";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import { buttonOverrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import Search from "../components/Search";

const Position = () => {
  const dispatch = useDispatch();

  const { positions, totalPosition, loading, successMessage, errorMessage } =
    useSelector((state) => state.position);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  useEffect(() => {
    // Reset to page 1 if searchValue is not empty
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1); // Reset page to 1 when a search is triggered
    }

    getPositions();
  }, [searchValue, currentPage, perPage, dispatch]);

  const getPositions = () => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchPositions(obj));
  };

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    description: "",
    changeReason: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      getPositions();

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
      dispatch(updatePosition(formData));
    } else {
      dispatch(createPosition(formData));
    }
  };

  const handleEdit = (position) => {
    setFormData(position);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deletePosition(deleteId));
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      description: "",
      changeReason: "",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/*  Header and Add Position */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold  text-center">Position Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Add Position
        </button>
      </div>

      {/* Search and Add Position */}

      <div className=" mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search Position..."}
        />
      </div>

      {/* Positions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Position Name</th>
              <th className="p-3">Description</th>
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
            ) : positions?.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No positions found.
                </td>
              </tr>
            ) : (
              positions?.map((position) => (
                <tr key={position._id} className="border-t">
                  <td className="p-2 text-lg capitalize">{position.name}</td>
                  <td className="p-2 text-lg capitalize">
                    {position.description}
                  </td>
                  <td className="p-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(position)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteConfirm(position._id, position.name)
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
      {totalPosition <= perPage ? (
        ""
      ) : (
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalPosition}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalPosition / perPage))}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? "Edit Position" : "Add Position"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Position Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded capitalize"
                required
                disabled={loading}
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded capitalize"
                disabled={loading}
              />
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
            <p>{`Are you sure you want to delete ${deleteName} position?`}</p>
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

export default Position;

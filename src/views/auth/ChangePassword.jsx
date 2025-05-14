import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "../../utils/utils";
import toast from "react-hot-toast";
import { changePassword, messageClear } from "../../store/Reducers/authReducer";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, errorMessage, successMessage, role } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      setError(errorMessage);
      dispatch(messageClear());
    }

    if (successMessage) {
      toast.success(successMessage);

      navigate("/");
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, navigate, dispatch]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    dispatch(changePassword({ newPassword }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-8 text-center">
          <p className="text-gray-600 text-lg font-bold">
            Please change password to continue
          </p>
        </div>

        <form onSubmit={handleChangePassword}>
          {error && (
            <div className="bg-red-100 p-3 mb-4 rounded text-red-500">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
            disabled={loading ? true : false}
          >
            {loading ? (
              <PropagateLoader color="#fff" cssOverride={buttonOverrideStyle} />
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

import { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getAllRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

//import the styles once globally (e.g., in your App.js or layout file):
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const dispatch = useDispatch();
  const { token, role, loading } = useSelector((state) => state.auth);

  const [allroutes, setAllRoutes] = useState([...publicRoutes]);

  // Initialize authentication on app start
  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (role) {
      const routes = getAllRoutes(role);
      setAllRoutes(routes);
    } else {
      setAllRoutes([...publicRoutes]);
    }
  }, [role]);

  // Show loading until app is initialized
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto"
              style={{
                animationDuration: "0.8s",
                animationDirection: "reverse",
              }}
            ></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading...
          </h2>
          <p className="text-gray-500">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <Router allRoutes={allroutes} />;
}

export default App;

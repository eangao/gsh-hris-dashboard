import { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getAllRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info, setInitialized } from "./store/Reducers/authReducer";

//import the styles once globally (e.g., in your App.js or layout file):
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const dispatch = useDispatch();
  const { token, role, isInitialized, loading } = useSelector((state) => state.auth);

  const [allroutes, setAllRoutes] = useState([...publicRoutes]);

  // Debug logging
  console.log(
    `App: Current role: "${role}", token: ${token ? "present" : "absent"}, initialized: ${isInitialized}, loading: ${loading}`
  );
  console.log(`App: Current routes count: ${allroutes.length}`);

  // Initialize authentication on app start
  useEffect(() => {
    if (token && !isInitialized) {
      console.log("App: Token exists, fetching user info");
      dispatch(get_user_info());
    } else if (!token && !isInitialized) {
      console.log("App: No token, marking as initialized");
      dispatch(setInitialized());
    }
  }, [token, isInitialized, dispatch]);

  useEffect(() => {
    if (role) {
      console.log(`App: Getting routes for role "${role}"`);
      const routes = getAllRoutes(role);
      console.log(`App: Received routes:`, routes);
      setAllRoutes([...publicRoutes, ...routes]);
    } else {
      console.log(`App: No role, using only public routes`);
      setAllRoutes([...publicRoutes]);
    }
  }, [role]);

  // Show loading until app is initialized
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto"
              style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
            ></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <Router allRoutes={allroutes} />;
}

export default App;

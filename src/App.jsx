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
  const { token, role } = useSelector((state) => state.auth);

  const [allroutes, setAllRoutes] = useState([...publicRoutes]);

  // Debug logging
  console.log(
    `App: Current role: "${role}", token: ${token ? "present" : "absent"}`
  );
  console.log(`App: Current routes count: ${allroutes.length}`);

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

  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [token, dispatch]);

  return <Router allRoutes={allroutes} />;
}

export default App;

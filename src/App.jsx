import { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

//import the styles once globally (e.g., in your App.js or layout file):
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);

  const [allroutes, setAllRoutes] = useState([...publicRoutes]);

  useEffect(() => {
    if (role) {
      const routes = getRoutes(role);
      setAllRoutes([...publicRoutes, routes]);
    }
  }, [role]);

  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [token]);

  return <Router allRoutes={allroutes} />;
}

export default App;

import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

const Router = ({ allRoutes }) => {
  const routes = useRoutes([...allRoutes]); // spread operator; pass all the data

  // return routes;

  return <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>;
};

export default Router;

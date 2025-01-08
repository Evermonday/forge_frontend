import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AppContext } from "../../context/AppContext";

const GuestRoutes = () => {
  const { user } = useContext(AppContext);

  // Check if User email is NOT true/exist then show the proper routes otherwise redirect to Dashboard page
  return !user ? <Outlet /> : <Navigate to="/" />;
};

export default GuestRoutes;
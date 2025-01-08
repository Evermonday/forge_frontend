import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AppContext } from "../../context/AppContext";

const AuthRoutes = () => {
  const { user } = useContext(AppContext);

  // Check if User email is true/exist then show the proper routes otherwise redirect to Login page
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoutes;
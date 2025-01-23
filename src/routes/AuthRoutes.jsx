import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import Login from "../pages/Auth/Login";
import { Outlet } from "react-router-dom";


const AuthRoutes = () => {
  const { user } = useContext(AppContext);

  // Check if User is true/exist then show the proper routes otherwise redirect to Login page
  return user ? <Outlet /> : <Login />;
};

export default AuthRoutes;
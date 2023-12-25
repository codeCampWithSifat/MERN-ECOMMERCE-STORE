/* eslint-disable react/prop-types */
// import { useSelector } from "react-redux";
// import { useLocation, Navigate } from "react-router-dom";
// const PrivateRoute = ({ children }) => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (!userInfo) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };
//export default PrivateRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

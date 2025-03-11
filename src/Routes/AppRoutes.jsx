import { Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/Login.jsx";
import HomePage from "../Pages/HomePageLayout.jsx";
import YourInfo from "../Pages/YourInfo.jsx";
import Orders from "../Pages/Orders.jsx";
import Category from "../Pages/Category.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={"/login"} element={<LoginPage />} />
      <Route element={<HomePage />}>
        <Route path={"/"} element={<YourInfo />} />
        <Route path={"/orders"} element={<Orders />} />
        <Route path={"/category"} element={<Category />} />
      </Route>
    </Routes>
  );
}

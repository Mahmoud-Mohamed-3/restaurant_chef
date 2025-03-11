import SideBar from "../Componenets/SideBar.jsx";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import "../css/home_page.css";

export default function HomePage() {
  const [cookies] = useCookies();
  useEffect(() => {
    if (!cookies.jwt) {
      window.location.href = "/login";
    }
  });
  return (
    <div className={"HomePageContainer"}>
      <SideBar />
      <div className={"OutLetContainer"}>
        <Outlet />
      </div>
    </div>
  );
}

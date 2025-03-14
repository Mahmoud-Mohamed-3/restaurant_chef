import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GetCurrentChefApi } from "../API Calls/GetChefInfo/CurrentChef.jsx";
import { Avatar, message } from "antd";
import "../css/side_bar.css";
import { Link, useLocation } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { LogoutApi } from "../API Calls/Logging/Logout.jsx";

export default function SideBar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(
    sessionStorage.getItem("activeLink") || "profile",
  );
  const [chefInfo, setChefInfo] = useState(
    JSON.parse(sessionStorage.getItem("chefInfo")) || null,
  );
  const [cookies, setCookies, removeCookie] = useCookies();

  useEffect(() => {
    const getChef = async () => {
      const response = await GetCurrentChefApi(cookies.jwt);
      if (response) {
        setChefInfo(response.data);
        sessionStorage.setItem("chefInfo", JSON.stringify(response.data));
      }
    };
    if (cookies.jwt && !chefInfo) {
      getChef();
    }
  }, [cookies.jwt, chefInfo]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const newActiveLink = path.includes("/orders")
      ? "orders"
      : path.includes("/category")
        ? "category"
        : path.includes("/stats")
          ? "stats"
          : path === "/"
            ? "profile"
            : activeLink;

    if (newActiveLink !== activeLink) {
      setActiveLink(newActiveLink);
      sessionStorage.setItem("activeLink", newActiveLink);
    }
  }, [location.pathname, activeLink]);
  const handleLogout = async () => {
    sessionStorage.removeItem("chefInfo");
    sessionStorage.removeItem("activeLink");

    if (cookies.jwt) {
      await LogoutApi(cookies.jwt);
    }

    removeCookie("jwt");

    // Show logout success message after JWT removal
    message.success("Logged out successfully");

    // Delay the redirect to allow the message to appear
    setTimeout(() => {
      window.location.replace("/login");
    }, 1000); // Delay the redirect by 1 second to show the message
  };
  return (
    <div className="SideBarContainer">
      <div className="Info">
        <div className="Avatar">
          <Avatar size={64} src={chefInfo?.profile_image_url} />
        </div>
        <div className="Name">
          <h2>{chefInfo?.first_name}</h2>
        </div>
      </div>
      <div className="Links">
        <Link to="/" className={activeLink === "profile" ? "active" : ""}>
          Profile
        </Link>
        <Link to="/orders" className={activeLink === "orders" ? "active" : ""}>
          Orders
        </Link>
        <Link
          to="/category"
          className={activeLink === "category" ? "active" : ""}
        >
          Mange Your Menu
        </Link>
        <Link to="/stats" className={activeLink === "stats" ? "active" : ""}>
          Stats
        </Link>
      </div>
      <div className={"ProfileActions"}>
        <button className={"Logout"} onClick={handleLogout}>
          <LogoutOutlined />
          Log Out
        </button>
      </div>
    </div>
  );
}

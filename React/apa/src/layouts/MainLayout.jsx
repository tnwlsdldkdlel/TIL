import { Outlet } from "react-router-dom";
import Header from "./Header";
import "../styles/layout.css";
import MainLogo from "./MainLogo";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <MainLogo />
      <Outlet />
    </div>
  );
};

export default MainLayout;

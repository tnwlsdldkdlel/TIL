import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutDialog from "../components/dialog/LogoutDialog";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogout, setIsLogout] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setIsLogout(false);
    setAnchorEl(null);
  };

  const clickLogin = () => {
    navigate("/login");
  };

  const clickLogout = () => {
    setAnchorEl(null);
    setIsLogout(true);
  };

  return (
    <div className="header">
      {user ? (
        <div className="login">
          <div className="user">
            {user.name} ({user.id})
          </div>
          <div className="menu">
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                  style={{ width: "30px", height: "30px", color: "white" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar sx={{ color: "#62a9f3", background: "white" }} />
                내정보
              </MenuItem>
              <MenuItem onClick={clickLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "red" }} />
                </ListItemIcon>
                로그아웃
              </MenuItem>
            </Menu>
          </div>
        </div>
      ) : (
        <div className="not-login">
          <div className="clickable" onClick={clickLogin}>
            로그인
          </div>
          <div className="user clickable" onClick={clickLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              style={{ width: "30px", height: "30px", color: "white" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
        </div>
      )}
      <LogoutDialog isOpen={isLogout} handleClose={handleClose}></LogoutDialog>
    </div>
  );
};

export default Header;

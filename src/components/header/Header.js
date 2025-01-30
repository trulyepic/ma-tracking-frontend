import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { Avatar, Dropdown, Menu, message } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getUserDetails, uploadAvatar } from "../../apis/api";
import AvatarUpload from "../sign-in-register/AvatarUpload";
import myLogo from "../../components/images/logo/myLogo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setUserDetails(null);
      return;
    }

    try {
      // const details = await getUserDetails();
      const details = location.state?.userDetails || (await getUserDetails());
      setIsAuthenticated(true);
      setUserDetails(details);
    } catch (error) {
      message.error("Failed to fetch user details.");
      setIsAuthenticated(false);
      setUserDetails(null);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUserDetails(null);
    navigate("/signin");
  };

  const menuItems = isAuthenticated
    ? [
        {
          key: "settings",
          label: "Settings",
          icon: <SettingOutlined />,
          onClick: () => navigate("/settings"),
        },
        {
          key: "upload-avatar",
          label: "Upload/Update Avatar",
          icon: <UploadOutlined />,
          onClick: () => setAvatarModalVisible(true),
        },
        {
          key: "logout",
          label: "Log Out",
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        },
        {
          key: "profile",
          label: "Profile",
          icon: <UserOutlined />,
          onClick: () => navigate(`/user-profile/${userDetails.id}`),
        },
      ]
    : [
        {
          key: "signin",
          label: "Sign In",
          onClick: () => navigate("/signin"),
        },
        {
          key: "register",
          label: "Register",
          onClick: () => navigate("/register"),
        },
      ];

  const handleLogoClick = () => {
    navigate("/");
  };
  console.log("userDetails: ", userDetails);
  return (
    <header className="app-header">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={myLogo} alt="Logo" className="app-logo" />
        <span className="app-title">Ex-hibt</span>
      </div>
      <div>
        <nav className="app-header-nav">
          <Link to="/"> Home</Link>
          <Link to="/list-collections">Public Collections</Link>
        </nav>
      </div>
      <div className="app-header-user-icon">
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          {isAuthenticated && userDetails?.avatarImageLink ? (
            <Avatar
              src={`${userDetails.avatarImageLink}`}
              size={40}
              icon={!userDetails?.avatarImageLink && <UserOutlined />}
              onError={() => {
                message.error("Failed to load avatar image.");
                return false;
              }}
            />
          ) : (
            <Avatar className="avatar" icon={<UserOutlined />} size={40} />
          )}
          {/* <UserOutlined
            style={{ fontSize: "24px", cursor: "pointer", color: "#ffffff" }}
          /> */}
        </Dropdown>
      </div>
      {isAvatarModalVisible && (
        <AvatarUpload
          visible={isAvatarModalVisible}
          onClose={() => setAvatarModalVisible(false)}
          onUpload={async (croppedFile) => {
            try {
              const formData = new FormData();
              formData.append("avatarImage", croppedFile);

              // const response = await uploadAvatar(formData);
              await uploadAvatar(formData);
              message.success("Avater successfully uploaded/updated!");
              getUserDetails().then((details) => setUserDetails(details)); // Refresh user details
            } catch {
              message.error("Failed to update avatar.");
            } finally {
              setAvatarModalVisible(false);
            }
          }}
        />
      )}
    </header>
  );
};

export default Header;

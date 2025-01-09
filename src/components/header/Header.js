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

  const menu = isAuthenticated ? (
    <Menu>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
        onClick={() => navigate("/settings")}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key="upload-avatar"
        icon={<UploadOutlined />}
        onClick={() => setAvatarModalVisible(true)}
      >
        Upload/Update Avatar
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Log Out
      </Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item key="signin" onClick={() => navigate("/signin")}>
        Sign In
      </Menu.Item>
      <Menu.Item key="register" onClick={() => navigate("/register")}>
        Register
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="app-header">
      <div>
        <nav className="app-header-nav">
          <Link to="/"> Home</Link>
          <Link to="/UserListPage">List of Collections</Link>
        </nav>
      </div>
      <div className="app-header-user-icon">
        <Dropdown overlay={menu} trigger={["click"]}>
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
            <Avatar icon={<UserOutlined />} size={40} />
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

              const response = await uploadAvatar(formData);
              message.success(response);
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

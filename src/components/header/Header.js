import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { Avatar, Dropdown, Menu, message } from "antd";
import {
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getUserDetails, uploadAvatar } from "../../apis/api";
import AvatarUpload from "../sign-in-register/AvatarUpload";
import myLogo from "../../components/images/logo/myLogo.png";
import { googleLogout } from "@react-oauth/google";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
    googleLogout();
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
        <nav className={`app-header-nav ${isMobileMenuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active-link" : ""}
          >
            {" "}
            Home
          </Link>
          <Link
            to="/list-collections"
            className={
              location.pathname === "/list-collections" ? "active-link" : ""
            }
          >
            Public Collections
          </Link>
        </nav>
      </div>
      <div className="app-header-user-icon">
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          {isAuthenticated && userDetails?.avatarImageLink ? (
            <Avatar
              src={`${userDetails.avatarImageLink}`}
              size={isMobile ? 70 : 40}
              icon={!userDetails?.avatarImageLink && <UserOutlined />}
              onError={() => {
                message.error("Failed to load avatar image.");
                return false;
              }}
            />
          ) : (
            <Avatar
              className="avatar"
              icon={<UserOutlined />}
              size={isMobile ? 70 : 40}
            />
          )}
          {/* <UserOutlined
            style={{ fontSize: "24px", cursor: "pointer", color: "#ffffff" }}
          /> */}
        </Dropdown>
      </div>
      {/* Mobile Menu Toggle Button */}
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
          <nav className="mobile-nav">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className={location.pathname === "/" ? "active-link" : ""}
            >
              Home
            </Link>
            <Link
              to="/list-collections"
              onClick={toggleMobileMenu}
              className={
                location.pathname === "/list-collections" ? "active-link" : ""
              }
            >
              Public Collections
            </Link>
          </nav>
        </div>
      )}
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

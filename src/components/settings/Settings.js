import React, { useState, useEffect } from "react";
import { Button, Input, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AvatarUpload from "../sign-in-register/AvatarUpload"; // Import your existing AvatarUpload component
import { getUserDetails, updateUserInfo, uploadAvatar } from "../../apis/api"; // Reuse the existing API functions
import "./Settings.css"; // Import the stylesheet

const Settings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const fetchUserDetails = async () => {
    try {
      const details = await getUserDetails();
      setUserDetails(details);
      setUsername(details?.name || "");
    } catch (error) {
      message.error("Failed to fetch user details.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleAvatarUpload = async (croppedFile) => {
    try {
      const formData = new FormData();
      formData.append("avatarImage", croppedFile);
      await uploadAvatar(formData); // Reuse the uploadAvatar API function
      message.success("Avatar successfully uploaded/updated!");
      fetchUserDetails(); // Refresh user details to update the avatar
    } catch (error) {
      message.error("Failed to update avatar.");
    } finally {
      setAvatarModalVisible(false);
    }
  };

  //   const handleSaveChanges = () => {
  //     // Placeholder logic for saving username and password
  //     if (username) {
  //       message.success("Username updated successfully!");
  //     }
  //     if (password.new && password.new === password.confirm) {
  //       message.success("Password updated successfully!");
  //     } else if (password.new !== password.confirm) {
  //       message.error("Passwords do not match!");
  //     }
  //   };

  const handleSaveChanges = async () => {
    try {
      if (password.new && password.new !== password.confirm) {
        message.error("Passwords do not match!");
        return;
      }
      const updateInfo = {};
      if (username) updateInfo.name = username;
      if (password.new) {
        updateInfo.password = password.new;
        updateInfo.currentPassword = password.current;
      }
      console.log("updateInfo: ", updateInfo);
      await updateUserInfo(updateInfo);
      message.success("User details updated successfully!");
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data === "Current password is incorrect."
      ) {
        // Show a specific error message for incorrect current password
        message.error("Current password is incorrect.");
      } else {
        // Generic error message for other errors
        message.error("Failed to update user info.");
      }
    }
  };

  //   console.log("userDetails: ", userDetails);
  return (
    <div className="settings-container">
      <h2>{username}</h2>

      {/* Display Current Avatar */}
      <div className="settings-section">
        {/* <span className="avatar-header-txt">Update Avatar</span> */}
        <div className="avatar-display">
          <Avatar
            src={userDetails?.avatarImageLink || null}
            size={200}
            icon={!userDetails?.avatarImageLink && <UserOutlined />}
            alt="User Avatar"
          />
          <Button
            type="primary"
            className="change-avatar-btn"
            onClick={() => setAvatarModalVisible(true)}
          >
            Change Avatar
          </Button>
        </div>
      </div>

      {/* Update Username Section */}
      <div className="settings-section">
        <h3>Update Username</h3>
        <Input
          placeholder="Enter new username"
          prefix={<UserOutlined />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Change Password Section */}
      <div className="settings-section">
        <h3>Change Password</h3>
        <Input.Password
          placeholder="Current password"
          className="password-input"
          value={password.current}
          onChange={(e) =>
            setPassword({ ...password, current: e.target.value })
          }
        />
        <Input.Password
          placeholder="New password"
          className="password-input"
          value={password.new}
          onChange={(e) => setPassword({ ...password, new: e.target.value })}
        />
        <Input.Password
          placeholder="Confirm new password"
          className="password-input"
          value={password.confirm}
          onChange={(e) =>
            setPassword({ ...password, confirm: e.target.value })
          }
        />
      </div>

      <Button type="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>

      {/* Avatar Upload Modal */}
      {isAvatarModalVisible && (
        <AvatarUpload
          visible={isAvatarModalVisible}
          onClose={() => setAvatarModalVisible(false)}
          onUpload={handleAvatarUpload}
        />
      )}
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from "react";
import { Button, Input, Avatar, message, Progress } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AvatarUpload from "../sign-in-register/AvatarUpload"; // Import your existing AvatarUpload component
import { getUserDetails, updateUserInfo, uploadAvatar } from "../../apis/api"; // Reuse the existing API functions
import "./Settings.css"; // Import the stylesheet
import {
  checkUsernameAvailabilityWrapper,
  isRestrictedUsername,
  passwordValidator,
  validatePassword,
} from "../util/helper";

const Settings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    numberAndLetter: false,
    notUserID: false,
  });
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

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

  const handleNewPasswordChange = (password) => {
    const { requirements, strength } = validatePassword(password, username);
    setRequirements(requirements);
    setPasswordStrength(strength);
  };

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
      if (username) {
        if (isRestrictedUsername(username)) {
          setUsernameError("Restricted username. Please choose another.");
          return;
        }
        if (isUsernameAvailable === false) {
          message.error("Username is already taken.");
          return;
        }
        updateInfo.name = username;
      }

      if (password.new) {
        const { isValid, error } = passwordValidator(password.new, username);
        if (!isValid) {
          message.error(error);
          return;
        }
        updateInfo.password = password.new;
        updateInfo.currentPassword = password.current;
      }
      // console.log("updateInfo: ", updateInfo);
      await updateUserInfo(updateInfo);
      message.success("User details updated successfully!");

      // Clear password fields after successful update
      setPassword({
        current: "",
        new: "",
        confirm: "",
      });
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
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };
  const handleUsernameBLur = async () => {
    if (isRestrictedUsername(username)) {
      setUsernameError("Restricted username. Please choose another.");
      return;
    }
    await checkUsernameAvailabilityWrapper(
      username,
      setIsUsernameAvailable,
      setUsernameError
    );
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
          // onChange={(e) => setUsername(e.target.value)}
          onChange={handleUsernameChange}
          onBlur={handleUsernameBLur}
        />
        {usernameError && <p className="error-text">{usernameError}</p>}
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
          onChange={(e) => {
            setPassword({ ...password, new: e.target.value });
            handleNewPasswordChange(e.target.value);
          }}
        />

        <Progress percent={passwordStrength} showInfo={false} />
        <ul className="password-requirements">
          <li className={requirements.length ? "met" : ""}>
            Must be 8-32 characters
          </li>
          <li className={requirements.numberAndLetter ? "met" : ""}>
            Must contain at least 1 number and 1 letter
          </li>
          <li className={requirements.notUserID ? "met" : ""}>
            Must not match username
          </li>
        </ul>
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

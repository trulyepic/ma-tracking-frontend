import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Modal,
  message,
  Progress,
  Spin,
} from "antd";
import "./Register.css";
import { checkUsernameAvailability, registerUser } from "../../apis/api";
import { UploadOutlined } from "@ant-design/icons";
import AvatarEditor from "react-avatar-editor";
import AvatarUpload from "./AvatarUpload";
import { useNavigate } from "react-router-dom";
import myLogo from "../../components/images/logo/myLogo.png";

const restrictedUsernames = [
  "admin",
  "root",
  "superuser",
  "Administrator",
  "Admin",
  "Root",
  "Superuser",
];

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageText, setMessageText] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState({
    length: false,
    numberAndLetter: false,
    notUserID: false,
  });

  const validatePassword = (password) => {
    const length = password.length >= 8 && password.length <= 32;
    const numberAndLetter = /[A-Za-z]/.test(password) && /\d/.test(password);
    const notUserID = password !== form.getFieldValue("userName");
    setRequirements({ length, numberAndLetter, notUserID });

    const strength =
      (length ? 33 : 0) + (numberAndLetter ? 33 : 0) + (notUserID ? 34 : 0);
    setPasswordStrength(strength);

    return length && numberAndLetter && notUserID;
  };

  const isRestrictedUsername = (username) => {
    const normalizedUsername = username.toLowerCase();
    return restrictedUsernames.some((restricted) =>
      normalizedUsername.includes(restricted)
    );
  };

  const onUsernameBlur = async (username) => {
    setIsCheckingUsername(true);
    try {
      const normalizedUsername = username.toLowerCase();
      const isAvailable = await checkUsernameAvailability(normalizedUsername);
      setIsUsernameAvailable(isAvailable);
      if (!isAvailable) {
        form.setFields([
          {
            name: "userName",
            errors: ["Username is already taken."],
          },
        ]);
      }
    } catch (error) {
      message.error("Failed to check username availability. please try again.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const passwordValidator = (_, value) => {
    if (!value) {
      return Promise.reject(
        new Error("Password is required and does not meet the requirements.")
      );
    }

    if (validatePassword(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Password does not meet the requirements.")
    );
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", values.userName);
    formData.append("userEmail", values.userEmail);
    formData.append("userPassword", values.userPassword);

    if (avatarImage) {
      formData.append("avatarImage", avatarImage);
    } else {
      console.log("No avatar image selected.");
    }

    // try {
    //   const response = await registerUser(formData);
    //   setMessageText(response.message || "User registered successfully!");
    //   navigate("/signin");
    // } catch (error) {
    //   setMessageText(error.message);
    // }
    try {
      await registerUser(formData);

      message.info(
        "Registration successful! Please check your email to confirm your account."
      );
      navigate("/confirm-email");

      // setMessageText(response.message || "User registered successfully!");
      // message.success("Registration Successful!");
      // navigate("/signin");
    } catch (error) {
      if (error.error) {
        setMessageText(error.error); // Handle structured error messages
        message.error(messageText);
      } else {
        setMessageText("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  //   console.log("avaterImage: ", avatarImage);
  // console.log("message text: ", messageText);
  return (
    <main>
      <div className="register-container">
        <div className="signin-header">
          <img src={myLogo} alt="Logo" className="signin-logo" />
          <span className="signin-title">Ex-hibt</span>
        </div>
        {/* <h2>Register</h2> */}
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            // label="Username"
            name="userName"
            // rules={[{ required: true, message: "Please input your name!" }]}
            rules={[
              { required: true, message: "Please input your username!" },
              () => ({
                validator(_, value) {
                  if (isRestrictedUsername(value)) {
                    return Promise.reject(
                      new Error("Restricted username. Please choose another.")
                    );
                  }
                  if (isUsernameAvailable === false) {
                    return Promise.reject(
                      new Error("Username is already taken.")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              className="reg-input"
              placeholder="Username"
              onBlur={(e) => onUsernameBlur(e.target.value)}
              loading={isCheckingUsername}
            />
          </Form.Item>
          <Form.Item
            // label="E-mail address"
            name="userEmail"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email" },
            ]}
          >
            <Input className="reg-input" placeholder="Email" />
          </Form.Item>
          <Form.Item
            // label="Password"
            name="userPassword"
            rules={[
              { required: true, message: "Please input your password!" },
              { validator: passwordValidator },
            ]}
          >
            <Input.Password
              className="reg-input"
              placeholder="Password"
              onChange={(e) => validatePassword(e.target.value)}
            />
          </Form.Item>

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

          <Form.Item
            // label="Confirm Password"
            name="confirmPassword"
            dependencies={["userPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("userPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className="reg-input"
              placeholder="Confirm password"
            />
          </Form.Item>

          {/* <Form.Item label="Avatar (Optional)">
            <Button type="primary" onClick={() => setAvatarModalVisible(true)}>
              Upload Avatar
            </Button>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin size="small" /> : "Sign up"}
            </Button>
          </Form.Item>
          {/* Show loading spinner while processing */}
          {/* {loading && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <Spin size="large" tip="Registering your account..." />
            </div>
          )} */}
        </Form>
        {/* {messageText && <p className="register-notice">{messageText}</p>} */}

        {/* {isAvatarModalVisible && (
          <AvatarUpload
            visible={isAvatarModalVisible}
            onClose={() => setAvatarModalVisible(false)}
            onUpload={(croppedFile) => {
              setAvatarImage(croppedFile);
              setAvatarModalVisible(false);
            }}
          />
        )} */}
      </div>
    </main>
  );
};

export default Register;

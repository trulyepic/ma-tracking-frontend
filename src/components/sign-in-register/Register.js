import React, { useState } from "react";
import { Form, Input, Button, Upload, Modal, message } from "antd";
import "./Register.css";
import { registerUser } from "../../apis/api";
import { UploadOutlined } from "@ant-design/icons";
import AvatarEditor from "react-avatar-editor";
import AvatarUpload from "./AvatarUpload";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [avatarImage, setAvatarImage] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);

  const onFinish = async (values) => {
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
      const response = await registerUser(formData);
      setMessageText(response.message || "User registered successfully!");
      message.success("Registration Successful!");
      navigate("/signin");
    } catch (error) {
      if (error.error) {
        setMessageText(error.error); // Handle structured error messages
      } else {
        setMessageText("An unexpected error occurred. Please try again.");
      }
    }
  };

  //   console.log("avaterImage: ", avatarImage);
  console.log("message text: ", messageText);
  return (
    <main>
      <div className="register-container">
        <h2>Register</h2>
        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="userName"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input className="reg-input" />
          </Form.Item>
          <Form.Item
            label="E-mail address"
            name="userEmail"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email" },
            ]}
          >
            <Input className="reg-input" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="userPassword"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          {/* <Form.Item label="Avatar (Optional)">
            <Button type="primary" onClick={() => setAvatarModalVisible(true)}>
              Upload Avatar
            </Button>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        {messageText && <p className="register-notice">{messageText}</p>}

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

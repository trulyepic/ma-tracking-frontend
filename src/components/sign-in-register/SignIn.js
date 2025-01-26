import { GoogleOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserDetails, loginUser } from "../../apis/api";

const SignIn = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { email, password } = values;
      const response = await loginUser({
        userEmail: email,
        userPassword: password,
      });

      // Store the token in localStorage or cookies for further authentication
      localStorage.setItem("authToken", response.token);
      console.log(
        "Token saved to localStorage:",
        localStorage.getItem("authToken")
      );

      console.log("Login successful:", response);

      const userDetails = await getUserDetails();
      navigate("/", { state: { userDetails } });
    } catch (error) {
      console.error("Login failed:", error);
      alert(error); // Display error to the user
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <main>
      <div className="register-container">
        <h2>Sign in to your account</h2>
        <Form
          name="signin"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="E-mail address"
            name="email"
            rules={[
              { required: true, message: "Please input your e-mail address!" },
              { type: "email" },
            ]}
          >
            <Input
              placeholder="example@example.com"
              className="sign-placeholder"
            />
          </Form.Item>

          <Form.Item
            label="Your password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" icon={<GoogleOutlined />} block>
              Sign in with Google
            </Button>
          </Form.Item>
        </Form>

        <div className="signin-footer">
          <p>
            Not a user? <Link to="/register">Register yourself now</Link>
          </p>
          <Button size="large">
            <Link to="/forgot-password">I forgot my password</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SignIn;

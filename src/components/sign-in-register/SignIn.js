import { GoogleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Divider, Modal, Select } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserDetails,
  loginUser,
  resendEmailConfirmation,
} from "../../apis/api";
import myLogo from "../../components/images/logo/myLogo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [emailForResend, setEmailForResend] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("gmail");

  const handleResendConfirmation = async (email) => {
    setResendLoading(true);
    try {
      // Use the latest selected provider
      setSelectedProvider((currentProvider) => {
        // console.log(
        //   "Resending email for:",
        //   email,
        //   "Using provider:",
        //   currentProvider
        // ); // Debugging log
        resendEmailConfirmation(email, currentProvider)
          .then(() => {
            setResendSuccess(true);
            setResendError("");
          })
          .catch((error) => {
            setResendError(error || "Failed to resend email.");
          })
          .finally(() => {
            setResendLoading(false);
          });

        return currentProvider; // Return the current value to ensure correct state update
      });
    } catch (error) {
      setResendError(error || "Failed to resend email.");
    } finally {
      setResendLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const { email, password } = values;
      const response = await loginUser({
        userEmail: email,
        userPassword: password,
      });

      // Store the token in localStorage or cookies for further authentication
      localStorage.setItem("authToken", response.token);
      // console.log(
      //   "Token saved to localStorage:",
      //   localStorage.getItem("authToken")
      // );

      // console.log("Login successful:", response);

      const userDetails = await getUserDetails();
      navigate("/", { state: { userDetails } });
    } catch (error) {
      console.error("Login failed:", error);

      //   console.log("values.email = ", values.email);
      //   if (error === "Please confirm your email before logging in.") {
      //     console.log("Setting email for resend:", values.email);
      //     setEmailForResend(values.email);
      //     Modal.warning({
      //       title: "Email Not Confirmed",
      //       content: (
      //         <>
      //           <span className="signin-confirmation-email">
      //             Your email is not confirmed. Please check your inbox.
      //           </span>
      //           <Select
      //             className="signin-select"
      //             defaultValue="gmail"
      //             onChange={(value) => setSelectedProvider(value)}
      //             style={{ width: "100%" }}
      //           >
      //             <Select.Option value="gmail">Gmail</Select.Option>
      //             <Select.Option value="yahoo">Yahoo</Select.Option>
      //             <Select.Option value="outlook">Outlook</Select.Option>
      //           </Select>
      //           <Button
      //             type="primary"
      //             loading={resendLoading}
      //             onClick={() => handleResendConfirmation(values.email)}
      //             style={{ marginTop: "10px" }}
      //           >
      //             Resend Confirmation Email
      //           </Button>
      //           {resendSuccess && (
      //             <p style={{ color: "green" }}>
      //               Confirmation email resent successfully.
      //             </p>
      //           )}
      //           {resendError && <p style={{ color: "red" }}>{resendError}</p>}
      //         </>
      //       ),
      //     });
      //   } else {
      //     Modal.error({
      //       title: "Login Failed",
      //       content: "Invalid email or password. Please try again.",
      //     });
      //   }
      // }

      if (error === "Please confirm your email before logging in.") {
        Modal.warning({
          title: "Email Not Confirmed",
          content: (
            <>
              <span className="signin-confirmation-email">
                You need to confirm your email before logging in. Please check
                your inbox.
              </span>
            </>
          ),
        });
        // alert(
        //   "You need to confirm your email before logging in. Please check your inbox."
        // );
      } else {
        Modal.error({
          title: "Login Failed",
          content: (
            <>
              <span className="signin-confirmation-email">
                Login failed. Please check your credentials.
              </span>
            </>
          ),
        });
        // alert("Login failed. Please check your credentials.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  console.log("provider selectedProvider: ", selectedProvider);
  // console.log("emailForResend: ", emailForResend);
  return (
    <main>
      <div className="register-container">
        <div className="signin-header">
          <img src={myLogo} alt="Logo" className="signin-logo" />
          <span className="signin-title">Ex-hibt</span>
        </div>
        {/* <h2>Sign in to your account</h2> */}
        <Form
          name="signin"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            // label="E-mail address"
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
            // label="password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="sigin-btn"
            >
              Log In
            </Button>

            <div className="signin-footer-v2">
              <Link to="/forgot-password">Forgot Password?</Link>
              <Link to="/register">Sign up</Link>
            </div>
          </Form.Item>

          {/* <Divider className="signin-divider">OR</Divider> */}

          {/* <Form.Item>
            <Button type="default" icon={<GoogleOutlined />} block>
              Sign in with Google
            </Button>
          </Form.Item> */}
        </Form>

        {/* <div className="signin-footer">
          <p>
            Not a user? <Link to="/register">Register yourself now</Link>
          </p>
          <Button size="large">
            <Link to="/forgot-password">I forgot my password</Link>
          </Button>
        </div> */}
      </div>
    </main>
  );
};

export default SignIn;

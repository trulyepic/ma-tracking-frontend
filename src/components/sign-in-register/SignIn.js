import { GoogleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Divider, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserDetails,
  googleSignIn,
  loginUser,
  resendEmailConfirmation,
} from "../../apis/api";
import myLogo from "../../components/images/logo/myLogo.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "369568751036-h0k3gdhc6qb1idvtorg9lut69lml04t2.apps.googleusercontent.com";

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

      localStorage.setItem("authToken", response.token);

      const userDetails = await getUserDetails();
      navigate("/", { state: { userDetails } });
    } catch (error) {
      console.error("Login failed:", error);

      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Unknown error occurred";

      if (errorMessage === "Please confirm your email before logging in.") {
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
          className: "signin-modals",
        });
        navigate("/confirm-email");
      } else if (
        errorMessage ===
        "This account was registered using Google. Please sign in with Google."
      ) {
        Modal.warning({
          title: "Google Sign-In Required",
          content: (
            <>
              <span className="signin-confirmation-email">
                This account was registered using Google. Please sign in with
                Google.
              </span>
            </>
          ),
          className: "signin-modals",
        });
      } else {
        Modal.error({
          title: "Login Failed",
          content: (
            <>
              <span className="signin-confirmation-email">{errorMessage}</span>
            </>
          ),
          className: "signin-modals",
        });
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const response = await googleSignIn(token);
      localStorage.setItem("authToken", response.token);
      const userDetails = await getUserDetails();
      navigate("/", { state: { userDetails } });
    } catch (error) {
      console.error("Google Sign-in failed:", error);
      Modal.error({
        title: "Google Sign-in Failed",
        content: "Something went wrong.",
        className: "signin-modals",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const customizeGoogleButton = () => {
      const googleBtn = document.querySelector(".nsm7Bb-HzV7m-LgbsSe");
      if (googleBtn) {
        googleBtn.style.backgroundColor = "transparent";
        googleBtn.style.color = "#ffffff";
        googleBtn.style.border = "1px solid #a7a7a7";
        googleBtn.style.borderRadius = "8px";
      }
    };

    setTimeout(customizeGoogleButton, 1000); // Delay to allow Google to load
  }, []);

  // console.log("provider selectedProvider: ", selectedProvider);
  // console.log("emailForResend: ", emailForResend);
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                {
                  required: true,
                  message: "Please input your e-mail address!",
                },
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
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className="sign-placeholder"
              />
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

            <Divider className="signin-divider">OR</Divider>

            <Form.Item>
              {/* <Button type="default" icon={<GoogleOutlined />} block>
              Sign in with Google
            </Button> */}

              {/* Google Sign-in Button using Ant Design */}
              <div className="google-signin-container">
                <GoogleLogin
                  theme="outline"
                  text="signin"
                  size="large"
                  shape="rectangular"
                  logo_alignment="center"
                  width="300"
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    Modal.error({
                      title: "Google Sign-In Failed",
                      content: "Try again later.",
                      className: "signin-modals",
                    })
                  }
                />
              </div>
            </Form.Item>
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
    </GoogleOAuthProvider>
  );
};

export default SignIn;

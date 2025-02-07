import React, { useState } from "react";
import { Button, Input, Avatar, message, Progress, Form } from "antd";
import myLogo from "../../components/images/logo/myLogo.png";
import { passwordValidator, validatePassword } from "../util/helper";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../apis/api";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    numberAndLetter: false,
    notUserID: false,
  });
  const [showChangePassword, setShowChangePassword] = useState(
    location.state?.showChangePassword || false
  );
  const [loading, setLoading] = useState(false);

  const handleNewPasswordChange = (password) => {
    const { requirements, strength } = validatePassword(password);
    setRequirements(requirements);
    setPasswordStrength(strength);
  };

  const handleContinue = async () => {
    if (!email) {
      message.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      message.success("Verification code sent!");

      //navigate to confirmEmailPage with email & reset flow flag
      navigate("/confirm-email", {
        state: { email, fromForgotPassword: true },
      });
    } catch (error) {
      message.error(error.response?.data || "Error sending verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewPassword = async () => {
    try {
      if (password.new !== password.confirm) {
        message.error("Passwords do not match!");
        return;
      }

      const { isValid, error } = passwordValidator(password.new);
      if (!isValid) {
        message.error(error);
        return;
      }

      setLoading(true);
      await resetPassword(email, password.new);
      message.success("Password changed successfully!");

      navigate("/signin"); // Redirect to sign-in page
    } catch (error) {
      message.error(error.response?.data || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="register-container">
        <div className="settings-section">
          <div className="signin-header">
            <img src={myLogo} alt="Logo" className="signin-logo" />
            <span className="signin-title">Ex-hibt</span>
          </div>

          <Form>
            {!showChangePassword ? (
              <Form.Item
                name="Email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sign-placeholder"
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="NewPassword"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    placeholder="New password"
                    value={password.new}
                    onChange={(e) => {
                      setPassword({ ...password, new: e.target.value });
                      handleNewPasswordChange(e.target.value);
                    }}
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
                  name="confirmPassword"
                  dependencies={["NewPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm new password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword({ ...password, confirm: e.target.value })
                    }
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button
                type="primary"
                onClick={
                  showChangePassword ? handleSaveNewPassword : handleContinue
                }
                loading={loading}
                htmlType="submit"
                block
              >
                {showChangePassword ? "Change password" : "Continue"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;

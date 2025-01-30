import React, { useState } from "react";
import { Button, Input, Avatar, message, Progress, Form } from "antd";
import myLogo from "../../components/images/logo/myLogo.png";
import { passwordValidator, validatePassword } from "../util/helper";

const ForgotPassword = () => {
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

  const handleNewPasswordChange = (password) => {
    const { requirements, strength } = validatePassword(password);
    setRequirements(requirements);
    setPasswordStrength(strength);
  };

  const handleSaveNewPassword = async () => {
    try {
      if (password.new && password.new !== password.confirm) {
        message.error("Passwords do not match!");
        return;
      }

      const newPassword = {};
      if (password.new) {
        const { isValid, error } = passwordValidator(password.new);
        if (!isValid) {
          message.error(error);
          return;
        }
      }
    } catch (error) {}
  };
  return (
    <main>
      <div className="register-container">
        <div className="settings-section">
          <div className="signin-header">
            <img src={myLogo} alt="Logo" className="signin-logo" />
            <span className="signin-title">Ex-hibit</span>
          </div>

          <Form>
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
                { required: true, message: "Please confirm your password!" },
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

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Change password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;

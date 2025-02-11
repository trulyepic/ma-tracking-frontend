import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  confirmEmail,
  resendVerificationCode,
  verifyEmailCode,
} from "../../apis/api";
import { Result, Spin, Button, Input, message } from "antd";
import { CheckCircleFilled, CheckOutlined } from "@ant-design/icons";
import TooltipWrapper from "../util/TooltipWrapper";

const ConfirmEmailPage = () => {
  const location = useLocation();
  // const email = location.state?.email;
  const fromForgotPassword = location.state?.fromForgotPassword;

  const [status, setStatus] = useState("pending"); // Default: Waiting for confirmation
  // const [message, setMessage] = useState(
  //   "Processing your email confirmation..."
  // );
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem("userEmail")
  );

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const RESEND_WAIT_TIME = 10 * 60 * 1000;

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem("userEmail", location.state.email);
    }

    const lastResendTime = localStorage.getItem("lastResendTime");
    if (lastResendTime) {
      const elapsedTime = Date.now() - parseInt(lastResendTime, 10);
      if (elapsedTime < RESEND_WAIT_TIME) {
        setResendDisabled(true);
        setTimeRemaining(Math.ceil((RESEND_WAIT_TIME - elapsedTime) / 1000));

        const interval = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [location.state?.email]);

  // useEffect(() => {
  //   const token = searchParams.get("token");
  //   console.log("Extracted token:", token); // Debugging log

  //   if (!token) {
  //     setMessage("Awaiting email confirmation...");

  // **Navigate to Sign-In after 5 seconds if there's no token**
  // const timer = setTimeout(() => {
  //   navigate("/signin");
  // }, 5000); // Delay in milliseconds

  // return () => clearTimeout(timer); // Cleanup the timeout on unmount
  // }

  // const handleConfirmation = async () => {
  //   try {
  //     await confirmEmail(token);
  //     setStatus("success");
  //     setMessage("Your email has been successfully confirmed!");
  //   } catch (error) {
  //     console.error("Email confirmation failed:", error);
  //     setStatus("error");
  //     setMessage(
  //       "Failed to confirm email. The token might be invalid or expired."
  //     );
  //   }
  // };

  //   handleConfirmation();
  // }, [searchParams, navigate]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Only allow numeric input and limit length to 6 characters
    if (value === "" || (/^\d+$/.test(value) && value.length <= 6)) {
      setCode(value);
    }
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      message.error("Please enter the full 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmailCode(code);
      message.success("Verification successfully!");

      if (fromForgotPassword) {
        navigate("/forgot-password", {
          state: { email, showChangePassword: true },
        });
      } else {
        navigate("/signin");
      }
    } catch (error) {
      message.error(
        error.response?.data || "Invalid or expired verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      message.error("Email not found. Please go back and re-enter your email");
      return;
    }

    setResendLoading(true);
    try {
      await resendVerificationCode(email);
      message.success("Verification code resent successfully!");

      // Save timestamp to local storage and disable button
      localStorage.setItem("lastResendTime", Date.now().toString());
      setResendDisabled(true);
      setTimeRemaining(RESEND_WAIT_TIME / 1000);

      // Start countdown timer
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error(error || "Failed to resend verification code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 className="verification-txt">Email Verification</h2>
      <p className="verification-txt">
        Enter the 6-digit code sent to your email.
      </p>
      <Input
        className="verification-input"
        placeholder="Enter Code"
        value={code}
        onChange={handleInputChange}
        style={{ width: "250px", marginBottom: "10px" }}
        maxLength={6}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <br />
      <div className="confirm-btn">
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          // icon={<CheckOutlined />}
        >
          Verify Email
        </Button>

        <TooltipWrapper
          tooltipContent={`You can resend the code in ${timeRemaining} seconds.`}
          isDisabled={resendDisabled}
        >
          <Button
            onClick={handleResendCode}
            loading={resendLoading}
            disabled={resendDisabled}
          >
            Resend Code
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       {status === "pending" && (
//         <Result
//           status="info"
//           title="Confirming Email"
//           subTitle={message}
//           extra={<Spin size="large" />}
//         />
//       )}
//       {status === "success" && (
//         <Result
//           status="success"
//           title="Email Confirmed"
//           subTitle="Your email has been successfully confirmed. You can now log in."
//           extra={
//             <Button type="primary" onClick={() => navigate("/signin")}>
//               Go to Login
//             </Button>
//           }
//         />
//       )}
//       {status === "error" && (
//         <Result
//           status="error"
//           title="Email Confirmation Failed"
//           subTitle={message}
//           extra={
//             <Button type="primary" onClick={() => navigate("/")}>
//               Go to Homepage
//             </Button>
//           }
//         />
//       )}
//     </div>
//   );
// };

export default ConfirmEmailPage;

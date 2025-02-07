import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmEmail, verifyEmailCode } from "../../apis/api";
import { Result, Spin, Button, Input, message } from "antd";
import { CheckCircleFilled, CheckOutlined } from "@ant-design/icons";

const ConfirmEmailPage = () => {
  const [status, setStatus] = useState("pending"); // Default: Waiting for confirmation
  // const [message, setMessage] = useState(
  //   "Processing your email confirmation..."
  // );
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
      message.success("Email confirmed successfully!");
      navigate("/signin"); // Redirect to homepage after successful confirmation
    } catch (error) {
      message.error(error || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
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
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        // icon={<CheckOutlined />}
      >
        Verify Email
      </Button>
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

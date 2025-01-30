import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmEmail } from "../../apis/api";
import { Result, Spin, Button } from "antd";

const ConfirmEmailPage = () => {
  const [status, setStatus] = useState("pending"); // Default: Waiting for confirmation
  const [message, setMessage] = useState(
    "Processing your email confirmation..."
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Extracted token:", token); // Debugging log

    if (!token) {
      setMessage("Awaiting email confirmation...");

      // **Navigate to Sign-In after 5 seconds if there's no token**
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 5000); // Delay in milliseconds

      return () => clearTimeout(timer); // Cleanup the timeout on unmount
    }

    const handleConfirmation = async () => {
      try {
        await confirmEmail(token);
        setStatus("success");
        setMessage("Your email has been successfully confirmed!");
      } catch (error) {
        console.error("Email confirmation failed:", error);
        setStatus("error");
        setMessage(
          "Failed to confirm email. The token might be invalid or expired."
        );
      }
    };

    handleConfirmation();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "pending" && (
        <Result
          status="info"
          title="Confirming Email"
          subTitle={message}
          extra={<Spin size="large" />}
        />
      )}
      {status === "success" && (
        <Result
          status="success"
          title="Email Confirmed"
          subTitle="Your email has been successfully confirmed. You can now log in."
          extra={
            <Button type="primary" onClick={() => navigate("/signin")}>
              Go to Login
            </Button>
          }
        />
      )}
      {status === "error" && (
        <Result
          status="error"
          title="Email Confirmation Failed"
          subTitle={message}
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Go to Homepage
            </Button>
          }
        />
      )}
    </div>
  );
};

export default ConfirmEmailPage;

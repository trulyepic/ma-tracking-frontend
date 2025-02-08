import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <Result
        className="four-txt"
        status="404"
        title="404"
        subTitle="Oops! The page you're looking for doesn't exist."
        extra={
          <div className="button-group">
            <Button
              type="primary"
              className="not-found-btn"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              type="default"
              className="home-btn"
              onClick={() => navigate("/")}
            >
              Return Home
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFound;

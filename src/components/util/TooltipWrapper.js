import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";

const TooltipWrapper = ({ children, tooltipContent, isDisabled }) => {
  // const tooltipMessage = isGuest
  //   ? "You must log in or register to use this feature."
  //   : "You can only use this feature for your own collections.";

  const [isMobile, setIsMobile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  let pressTimer = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // const handleTouchStart = () => {
  //   if (!isDisabled) return;
  //   setShowTooltip(true);
  //   // pressTimer.current = setTimeout(() => {
  //   //   setShowTooltip(true);
  //   // }, 500); // Show tooltip after 500ms of press
  // };
  const handleTouchStart = () => {
    if (isDisabled && tooltipContent) {
      setShowTooltip(true);
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
    setTimeout(() => setShowTooltip(false), 1000); // Hide after 1 sec
  };

  return isMobile ? (
    <div
      ref={tooltipRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ display: "inline-block", position: "relative" }}
    >
      {children}
      {showTooltip && tooltipContent && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#000",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            zIndex: 999,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  ) : (
    <Tooltip title={isDisabled ? tooltipContent : ""}>{children}</Tooltip>
  );
};

export default TooltipWrapper;

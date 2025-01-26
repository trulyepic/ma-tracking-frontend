import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import "./SnippingTool.css"; // Add styles for the overlay and selection box

const SnippingTool = ({ onCapture, isActive }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Attach event listeners when the snipping tool is active
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      // Clean up event listeners when not active
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isActive, isSelecting, startPoint, endPoint]);

  const handleMouseDown = (e) => {
    if (isActive) {
      setStartPoint({ x: e.clientX, y: e.clientY });
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isActive && isSelecting) {
      setEndPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = async () => {
    if (isActive && isSelecting && startPoint && endPoint) {
      const canvas = await html2canvas(document.body);
      const context = canvas.getContext("2d");

      const x = Math.min(startPoint.x, endPoint.x);
      const y = Math.min(startPoint.y, endPoint.y);
      const width = Math.abs(endPoint.x - startPoint.x);
      const height = Math.abs(endPoint.y - startPoint.y);

      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedContext = croppedCanvas.getContext("2d");

      croppedContext.drawImage(
        canvas,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const base64Image = croppedCanvas.toDataURL("image/png");
      onCapture(base64Image);

      // Reset state
      setStartPoint(null);
      setEndPoint(null);
      setIsSelecting(false);
    }
  };

  return (
    <>
      {isActive && (
        <div className="snipping-overlay">
          {isSelecting && startPoint && endPoint && (
            <div
              className="selection-box"
              style={{
                left: Math.min(startPoint.x, endPoint.x),
                top: Math.min(startPoint.y, endPoint.y),
                width: Math.abs(endPoint.x - startPoint.x),
                height: Math.abs(endPoint.y - startPoint.y),
              }}
            ></div>
          )}
        </div>
      )}
    </>
  );
};

export default SnippingTool;

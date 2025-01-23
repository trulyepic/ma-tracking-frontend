import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Slider, Tooltip, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { applySharpenFilter } from "../util/helper";

const UploadEditImage = ({
  onImageChange,
  initialPreviewUrl = null,
  required = false,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl); // Use initial preview URL
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(500);
  const [imageQuality, setImageQuality] = useState(0.8);
  const canvasRef = useRef(null);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      setPreviewUrl(e.target.result);
      setIsModalVisible(true);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
    setOriginalFileName(file.name);
  };

  const handleFileChange = (info) => {
    if (info.file.status === "removed") {
      resetImageState();
      return;
    }

    const file = info.file.originFileObj;
    if (file) {
      processFile(file);
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   setOriginalImage(e.target.result);
      //   setPreviewUrl(e.target.result);
      //   setIsModalVisible(true);
      // };
      // reader.readAsDataURL(file);
      // setImageFile(file);
      // setOriginalFileName(file.name);
    }
  };

  const resetImageState = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setOriginalImage(null);
    setOriginalFileName("");
    setIsModalVisible(false);
  };

  const updateCanvasPreview = () => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = width * 3; // Double resolution for better quality
        canvas.height = height * 3;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(3, 3); // Maintain display scale
        ctx.drawImage(img, 0, 0, width, height);

        // Apply filters
        // applySharpenFilter(ctx, canvas);
        // applyContrastAndBrightness(ctx, canvas, 1.2, 15);

        setPreviewUrl(canvas.toDataURL("image/jpeg", imageQuality)); // Use quality for preview
      };
      img.src = originalImage;
    }
  };

  // useEffect(() => {
  //   if (originalImage && canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     const img = new Image();

  //     img.onload = () => {
  //       canvas.width = width; // doubling resolution for better quality
  //       canvas.height = height;
  //       // ctx.scale(2, 2);
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       ctx.drawImage(img, 0, 0, width, height);

  //       //Apply filters
  //       applySharpenFilter(ctx, canvas);
  //       setPreviewUrl(canvas.toDataURL("image/jpeg"));
  //     };
  //     img.src = originalImage;
  //   }
  // }, [width, height, originalImage]);

  useEffect(() => {
    if (isModalVisible) {
      updateCanvasPreview();
    }
  }, [isModalVisible, width, height, imageQuality]);

  const handleAcceptModal = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob], originalFileName, {
            type: "image/jpeg",
          });
          onImageChange(resizedFile);
          setIsModalVisible(false);
        },
        "image/jpeg",
        imageQuality
      );
    } else {
      message.error("Failed to process image.");
    }
  };

  return (
    <>
      {previewUrl && (
        <div style={{ marginBottom: "10px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              marginBottom: "10px",
            }}
          />
        </div>
      )}
      <Tooltip title="size prefrence width 350 and height 600">
        <Upload
          listType="picture"
          accept="image/*"
          maxCount={1}
          onChange={handleFileChange}
          onRemove={resetImageState}
        >
          <Button icon={<UploadOutlined />} className="upload-text">
            {previewUrl ? "Change Image" : "Upload Image"} {required && "*"}
          </Button>
        </Upload>
      </Tooltip>
      {/* <Button
        style={{ marginTop: "10px" }}
        onClick={() => {
          // trigger snipping tool
          window.dispatchEvent(new CustomEvent("start-snipping-tool"));
        }}
      >
        Select Image (Snipping Tool)
      </Button> */}

      <Modal
        title="Image Preview"
        visible={isModalVisible}
        footer={[
          <Button key="accept" type="primary" onClick={handleAcceptModal}>
            Accept
          </Button>,
        ]}
        closable={false}
      >
        {originalImage && (
          <div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", marginBottom: "10px" }}
            />
            <div>
              <label>Scale1:</label>
              <Slider
                min={100}
                max={700}
                value={width}
                onChange={(value) => setWidth(value)}
              />
              <label>Scale2:</label>
              <Slider
                min={100}
                max={700}
                value={height}
                onChange={(value) => setHeight(value)}
              />
              {/* <label>Quality:</label>
              <Slider
                min={0.5}
                max={1}
                step={0.1}
                value={imageQuality}
                onChange={(value) => setImageQuality(value)}
              /> */}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UploadEditImage;

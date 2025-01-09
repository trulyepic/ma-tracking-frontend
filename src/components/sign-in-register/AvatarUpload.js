import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import AvatarEditor from "react-avatar-editor";
import { UploadOutlined } from "@ant-design/icons";

const AvatarUpload = ({ visible = true, onClose, onUpload }) => {
  const [image, setImage] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(null); // Store original file name

  const handleUpload = (info) => {
    const file = info.file.originFileObj;
    // Validate file type
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      message.error("Only JPEG or PNG images are allowed.");
      return;
    }

    setOriginalFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!editorRef) {
      message.error("Please select an image first.");
      return;
    }

    const canvas = editorRef.getImageScaledToCanvas();
    canvas.toBlob((blob) => {
      if (!blob) {
        message.error("Failed to generate the cropped image.");
        return;
      }

      // Use the original file name if available, otherwise default to avatar.jpeg
      const croppedFileName = originalFileName || "avatar.jpeg";
      const croppedFile = new File([blob], croppedFileName, {
        type: "image/jpeg",
      });
      onUpload(croppedFile); // Pass the cropped file with the correct name
      onClose(); // Close the modal after saving
    }, "image/jpeg");
  };

  return (
    <Modal
      title="Crop Avatar"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      {image ? (
        <AvatarEditor
          ref={(ref) => setEditorRef(ref)}
          image={image}
          width={150}
          height={150}
          border={50}
          borderRadius={75}
          scale={1.2}
        />
      ) : (
        <Upload
          customRequest={() => {}}
          showUploadList={false}
          beforeUpload={(file) => {
            if (file.type !== "image/jpeg" && file.type !== "image/png") {
              message.error("Only JPEG or PNG images are allowed.");
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
          onChange={handleUpload}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
      )}
    </Modal>
  );
};

export default AvatarUpload;

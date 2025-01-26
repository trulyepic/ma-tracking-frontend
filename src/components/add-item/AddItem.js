import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Slider,
  Tooltip,
  Upload,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { saveUserItem } from "../../apis/api";
import { UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddItem.css";
import { addItemToCollection } from "../../apis/apiCollection";
import UploadEditImage from "./UploadEditImage";
import { base64ToFile } from "../util/helper";
import SnippingTool from "./SnippingTool";

const AddItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId } = location.state;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(500);
  const [snippingToolActive, setSnippingToolActive] = useState(false);

  const handleSubmit = async (values) => {
    if (!imageFile) {
      message.error("Please upload an image file.");
      return;
    }

    // Set default text for empty fields
    const updatedValues = {
      ...values,
      content: values.content || "No notes", // Default for short notes
      longContent: values.longContent || "No description", // Default for long notes
    };

    setLoading(true);
    try {
      console.log("Submitting imageFile:", imageFile);
      await addItemToCollection(collectionId, updatedValues, imageFile);
      message.success("Item added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding item:", error);
      message.error("Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // console.log("Image file: ", imageFile);
  // console.log("previewUrl = ", previewUrl);
  return (
    <div className="add-item-container">
      {/* <SnippingTool
        onCapture={handleSnippingCapture}
        isActive={snippingToolActive}
      /> */}
      <span className="add-item-title">Enter item details</span>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        // initialValues={{
        //   title: "",
        //   genre: "",
        //   content: "",
        //   longContent: "",
        // }}
        className="add-item-form"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: "please enter the series title." },
          ]}
        >
          <Input placeholder="Enter item title" className="sign-placeholder" />
        </Form.Item>

        <Form.Item
          name="genre"
          label="Tags"
          rules={[
            {
              required: true,
              message: "Please enter tags.",
            },
          ]}
        >
          <Input
            placeholder="Enter tags. Use , to separate multiple tags"
            className="sign-placeholder"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Short Notes"
          rules={[
            { message: "Please enter short notes." },
            { max: 50, message: "Short notes cannot exceed 50 characters." },
          ]}
        >
          <Input
            placeholder="Enter short notes (max 50 characters)"
            rows={4}
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="longContent"
          label="Description"
          rules={[{ message: "Please enter any additonal notes." }]}
          className="add-item-long-note-form-item"
        >
          <Input.TextArea
            placeholder="Enter any additonal notes"
            rows={6}
            className="sign-placeholder"
          />
        </Form.Item>

        <Form.Item label="Image File" required>
          <UploadEditImage
            onImageChange={(file) => {
              console.log("Processed file received:", file);
              setImageFile(file);
            }}
            required
          />
        </Form.Item>

        {/* <Button
          type="default"
          style={{ marginBottom: "10px" }}
          onClick={() => setSnippingToolActive(true)}
        >
          Select Image (Snipping Tool)
        </Button> */}

        <Form.Item>
          <div className="edit-btns">
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button
              type="default"
              onClick={handleCancel}
              className="cancel-btn"
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddItem;

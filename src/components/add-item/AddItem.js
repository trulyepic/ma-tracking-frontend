import { Button, Form, Input, message, Upload } from "antd";
import React, { useState } from "react";
import { saveUserItem } from "../../apis/api";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";

const AddItem = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (info) => {
    const { file } = info;

    // Handle file addition
    if (info.file.status === "uploading") return;

    if (file.originFileObj) {
      setImageFile(file.originFileObj);
    } else if (info.file.status === "removed") {
      setImageFile(null); // Clear file on removal
    }
  };

  const handleSubmit = async (values) => {
    // console.log("Payload to be sent:", { ...values, imageFile });
    const { title, genre, content, longContent } = values;

    if (!imageFile) {
      message.error("Please upload an image file.");
      return;
    }

    setLoading(true);
    try {
      // Use the saveUserItem API
      const response = await saveUserItem(
        {
          title,
          genre,
          content,
          longContent,
        },
        imageFile
      );

      console.log("values from handlSubmit: ", values);
      message.success("Item saved successfully!");
      form.resetFields(); // Clear form
      setImageFile(null);
      navigate("/");
    } catch (error) {
      console.error("Error saving item:", error);
      message.error("Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // console.log("Image file: ", imageFile);
  return (
    <div className="add-item-container">
      <span className="add-item-title">Enter item details</span>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: "",
          genre: "",
          content: "",
          longContent: "",
        }}
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
              message: "Please enter the genre.",
            },
          ]}
        >
          <Input
            placeholder="Enter genre. Use , to separate multiple genres"
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
          label="Long Notes"
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
          <Upload
            listType="picture"
            accept="image/*"
            maxCount={1}
            beforeUpload={(file) => {
              setImageFile(file);
              return false;
            }} // Prevent auto upload
            onChange={handleFileChange} // Handle file changes
            onRemove={() => setImageFile(null)} // Clear file on remove
          >
            <Button className="upload-text" icon={<UploadOutlined />}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddItem;

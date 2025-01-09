import { Button, Form, Input, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserItem } from "../../apis/api";
import Item from "antd/es/list/Item";
import { UploadOutlined } from "@ant-design/icons";

const EditItem = ({ existingItem }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID from URL params

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (existingItem) {
      form.setFieldsValue({
        title: existingItem.title,
        genre: existingItem.genre,
        content: existingItem.content,
        longContent: existingItem.longContent,
      });
    }
  }, [existingItem, form]);

  const handleFileChange = (info) => {
    const { file } = info;
    if (file.originFileObj) {
      setImageFile(file.originFileObj);
    } else if (info.file.status === "removed") {
      setImageFile(null);
    }
  };

  const handleSubmit = async (values) => {
    const { title, genre, content, longContent } = values;

    setLoading(true);
    try {
      await updateUserItem(
        id,
        { title, genre, content, longContent },
        imageFile
      );

      message.success("Item updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating item: ", error);
      message.error("Failed to update item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <span className="add-item-title">Edit item details</span>
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
          rules={[{ required: true, message: "Please enter the title." }]}
        >
          <Input placeholder="Enter item title" className="sign-placeholder" />
        </Form.Item>

        <Form.Item
          name="genre"
          label="Genre"
          rules={[{ required: true, message: "Please enter the genre." }]}
        >
          <Input
            placeholder="Enter genre (use commas for multiple genres)"
            className="sign-placeholder"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Short Notes"
          rules={[
            { max: 50, message: "Short notes cannot exceed 50 characters." },
          ]}
        >
          <Input
            placeholder="Enter short notes (max 50 characters)"
            className="sign-placeholder"
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item name="longContent" label="Long Notes">
          <Input.TextArea
            placeholder="Enter any additonal notes"
            rows={6}
            className="sign-placeholder"
          />
        </Form.Item>

        <Form.Item label="Image File">
          <Upload
            listType="picture"
            accept="image/*"
            maxCount={1}
            beforeUpload={(file) => {
              setImageFile(file);
              return false; // Prevent auto-upload
            }}
            onChange={handleFileChange}
            onRemove={() => setImageFile(null)}
          >
            <Button className="upload-text" icon={<UploadOutlined />}>
              Upload New Image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditItem;

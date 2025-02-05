import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createCollection,
  updateCollectionName,
} from "../../apis/apiCollection";
// import { createCollection } from "../apis/apiCollection";

const AddCollection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { mode, collectionId, collectionName } = location.state || {};

  useEffect(() => {
    if (mode === "update" && collectionName) {
      form.setFieldsValue({ name: collectionName });
    }
  }, [mode, collectionName, form]);

  const handleSubmit = async (values) => {
    const { name } = values;

    setLoading(true);
    try {
      if (mode === "update" && collectionId) {
        await updateCollectionName(collectionId, name);
        message.success("Collection name updated successfully!");
      } else {
        await createCollection(name);
        message.success("Collection created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error creating collection:", error);
      message.error("Failed to create collection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to the homepage
  };

  return (
    <div className="add-item-container">
      <span className="add-item-title">
        {mode === "update"
          ? "Update your Collection Name"
          : "Add new Collection"}
      </span>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ name: "" }}
        className="add-item-form"
      >
        <Form.Item
          name="name"
          label="Collection Name"
          rules={[
            { required: true, message: "Please enter a collection name." },
          ]}
        >
          <Input
            placeholder="Enter collection name"
            className="placeholder-txt"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === "update" ? "Update" : "Submit"}
          </Button>
          <Button
            type="default"
            onClick={handleCancel}
            style={{ marginLeft: "10px" }}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCollection;

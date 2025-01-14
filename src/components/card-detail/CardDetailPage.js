import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Image, message, Modal, Typography } from "antd";
// import Paragraph from "antd/es/skeleton/Paragraph";
// import Title from "antd/es/skeleton/Title";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CardDetailPage.css";
import { DiscussionEmbed } from "disqus-react";
import { deleteUserItem } from "../../apis/api";

const { Title, Paragraph } = Typography;

const CardDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  if (!state || !state.itemData) {
    return <div>Card not found!</div>;
  }
  const { title, imageUrl, content, longContent, isGuest, isOwner } =
    state.itemData;

  const handleEdit = () => {
    navigate(`/edititem/${id}`);
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action connot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUserItem(id);

      // navigate bact to the previous page
      navigate(-1);
      message.success("Item deleted successfully");
    } catch (error) {
      console.log("Error deleting item:", error);
      message.error("Failed to delete the item. Please try again.");
    }
  };

  const disqusShortname = "star-k-wiki";
  const disqusConfig = {
    url: `http://localhost:3001/card/${id}`,
    identifier: id,
    title: title,
  };

  // console.log("itemdata in carpage: ", state.itemData);
  return (
    <div className="card-detail-container">
      <Title level={3} className="card-title">
        {title}
      </Title>
      <Card
        className="card-cover"
        cover={<Image src={imageUrl} alt={title} />}
        // actions={[
        //   <Button
        //     type="primary"
        //     icon={<EditOutlined />}
        //     onClick={handleEdit}
        //     // disabled={isGuest || isOwner}
        //   ></Button>,
        //   <Button
        //     danger
        //     icon={<DeleteOutlined />}
        //     onClick={confirmDelete}
        //   ></Button>,
        // ]}
      >
        <Typography>
          <Paragraph className="card-content">
            {content || "No notes"}
          </Paragraph>

          <Paragraph className="card-long-content">
            {longContent || "No additional content available"}
          </Paragraph>
        </Typography>
      </Card>

      {/* disqus embed */}
      <div className="disqus-section">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    </div>
  );
};

export default CardDetailPage;

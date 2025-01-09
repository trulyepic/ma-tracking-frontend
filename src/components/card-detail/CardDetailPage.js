import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Image, Typography } from "antd";
// import Paragraph from "antd/es/skeleton/Paragraph";
// import Title from "antd/es/skeleton/Title";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CardDetailPage.css";

const { Title, Paragraph } = Typography;

const CardDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.itemData) {
    return <div>Card not found!</div>;
  }
  const { title, imageUrl, content, id, longContent } = state.itemData;

  const handleEdit = () => {
    navigate(`/edititem/${id}`);
  };

  const handleDelete = () => {
    //todo: delelte
  };

  console.log("itemdata in carpage: ", state.itemData);
  return (
    <div
      className="card-detail-container"
      //   style={{
      //     padding: "20px",
      //     maxWidth: "400px",
      //     margin: "0 auto",
      //   }}
    >
      <Title level={3} className="card-title">
        {title}
      </Title>
      <Card
        className="card-cover"
        cover={<Image src={imageUrl} alt={title} />}
        actions={[
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          ></Button>,
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          ></Button>,
        ]}
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
      {/* <h3 className="card-title">{title || "Untitled Item"}</h3>
      <div className="card-cover">
        <img
          src={imageUrl}
          alt={title || "No Image Available"}
          className="card-image"
        />
      </div>
      <div className="card-actions">
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <div className="card-content">
        <p>{content || "No notes available"}</p>
        <p>{longContent || "No additional content available"}</p>
      </div> */}
    </div>
  );
};

export default CardDetailPage;

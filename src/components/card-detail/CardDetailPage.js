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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rotation, setRotation] = useState(0);

  if (!state || !state.itemData) {
    return <div>Card not found!</div>;
  }
  const { title, imageUrl, content, longContent, isGuest, isOwner } =
    state.itemData;

  // url: `http://localhost:3001/card/${id}`,
  const disqusShortname = "ex-hibt";
  const disqusConfig = {
    url: `https://www.ex-hibt.com/card/${id}`,
    identifier: id,
    title: title,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const rotateImage = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  // console.log("itemdata in carpage: ", state.itemData);
  return (
    <div>
      <div className="card-detail-container">
        <Title level={3} className="card-title">
          {title}
        </Title>
        <Card
          className="card-cover"
          cover={
            <Image
              src={imageUrl}
              alt={title}
              preview={false}
              onClick={showModal}
              // style={{ transform: `rotate(${rotation}deg)` }} //rotation
            />
          }
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
      </div>

      {/* Modal for larger card preview */}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={hideModal}
        centered
        width={700} // Adjust modal width for better preview
        className="card-detail-modal"
      >
        <Card
          cover={
            <Image
              src={imageUrl}
              alt={title}
              preview={false}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.5s ease",
              }}
            />
          }
        >
          <Button onClick={rotateImage} className="card-long-content">
            Rotate Image
          </Button>
          <Typography>
            <Title level={4} className="card-title">
              {title}
            </Title>
            {/* <Paragraph className="card-content">
              {content || "No notes"}
            </Paragraph> */}
            <Paragraph className="card-long-content">
              {longContent || "No additional content available"}
            </Paragraph>
          </Typography>
        </Card>
      </Modal>
      {/* disqus embed */}
      <div className="disqus-section">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    </div>
  );
};

export default CardDetailPage;

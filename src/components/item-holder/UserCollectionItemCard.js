import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

const UserCollectionItemCard = ({
  title,
  genre,
  imageUrl,
  id,
  notes,
  onDelete,
  itemData,
}) => {
  const navigate = useNavigate();
  const confirmDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        if (onDelete) {
          onDelete(id);
        }
      },
    });
  };

  const handleEdit = () => {
    navigate(`/edititem/${id}`);
  };

  const handleCardClick = () => {
    navigate(`/card/${id}`, { state: { itemData } });
  };

  // console.log("itemData from usercollection item: ", itemData);
  return (
    <div className="user-collection-item-card">
      <LazyLoadImage
        src={imageUrl}
        alt={`${title} - A ${genre} item`}
        effect="blur"
        className="user-collection-item-image"
        onClick={handleCardClick}
      />
      {/* <img
        src={imageUrl}
        alt={`${title} - A ${genre} item`}
        className="user-collection-item-image"
        onClick={handleCardClick}
      /> */}

      <div className="user-collection-item-card-content">
        <h3>{title}</h3>
        <p>{genre}</p>
        <p>{notes}</p>
        <div className="card-btns">
          <Button
            type="primary"
            size="small"
            danger
            onClick={confirmDelete}
            icon={<DeleteOutlined />}
            className="user-collection-delete-btn"
          >
            {/* Delete */}
          </Button>

          <Button
            type="primary"
            size="small"
            onClick={handleEdit}
            icon={<EditOutlined />}
          >
            {/* Edit */}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCollectionItemCard;

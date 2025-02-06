import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { withTooltip } from "../util/helper";
import TooltipWrapper from "../util/TooltipWrapper";

const UserCollectionItemCard = ({
  title,
  genre,
  imageUrl,
  id,
  notes,
  onDelete,
  itemData,
  isGuest,
  isOwner,
  collectionId,
}) => {
  const navigate = useNavigate();
  // const confirmDelete = () => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this item?",
  //     content: "This action cannot be undone.",
  //     okText: "Delete",
  //     okType: "danger",
  //     cancelText: "Cancel",
  //     onOk: () => {
  //       onDelete(itemData.collectionId, id);
  //     },
  //   });
  // };

  const handleEdit = () => {
    navigate(`/edititem/${id}`, {
      state: { existingItem: itemData, collectionId },
    });
  };

  const handleCardClick = () => {
    navigate(`/card/${id}`, { state: { itemData, isGuest, isOwner } });
  };

  // console.log(
  //   "guest in user collection card: ",
  //   isGuest,
  //   "isowner: ",
  //   !isOwner
  // );
  // console.log("itemData from usercollection item: ", collectionId);
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
        <p className="user-collection-item-card-tags">{genre}</p>
        <p className="user-collection-item-card-notes">{notes}</p>
        <div className="card-btns">
          {/* {withTooltip(
            <Button
              type="primary"
              size="medium"
              danger
              onClick={() => onDelete(id)}
              icon={<DeleteOutlined />}
              className="user-collection-delete-btn"
              disabled={isGuest || !isOwner}
            >
             
            </Button>,
            isGuest || !isOwner,
            isGuest
          )} */}

          <TooltipWrapper
            tooltipContent={
              isGuest || !isOwner
                ? "Must be your collections."
                : "You must log in or register to use this feature."
            }
            isDisabled={isGuest || !isOwner}
          >
            <Button
              type="primary"
              size="medium"
              danger
              onClick={() => onDelete(id)}
              icon={<DeleteOutlined />}
              className="user-collection-delete-btn"
              disabled={isGuest || !isOwner}
            >
              {/* Delete */}
            </Button>
          </TooltipWrapper>

          {/* {withTooltip(
            <Button
              type="primary"
              size="medium"
              onClick={handleEdit}
              icon={<EditOutlined />}
              className="user-collection-edit-btn"
              disabled={isGuest || !isOwner}
            >

            </Button>,
            isGuest || !isOwner,
            isGuest
          )} */}

          <TooltipWrapper
            tooltipContent={
              isGuest || !isOwner
                ? "Must be your collections."
                : "You must log in or register to use this feature."
            }
            isDisabled={isGuest || !isOwner}
          >
            <Button
              type="primary"
              size="medium"
              onClick={handleEdit}
              icon={<EditOutlined />}
              className="user-collection-edit-btn"
              disabled={isGuest || !isOwner}
            >
              {/* Edit */}
            </Button>
          </TooltipWrapper>
        </div>
      </div>
    </div>
  );
};

export default UserCollectionItemCard;

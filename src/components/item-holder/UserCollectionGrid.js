import React from "react";
import UserCollectionItemCard from "./UserCollectionItemCard";

const UserCollectionGrid = ({ items, onDelete }) => {
  // console.log("items from user collection grid: ", items);
  return (
    <div className="user-collection-grid">
      {items.map((item) => (
        <UserCollectionItemCard
          key={item.id}
          title={item.title}
          genre={item.genre}
          imageUrl={item.imageUrl}
          id={item.id}
          itemData={item}
          notes={item.content}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default UserCollectionGrid;
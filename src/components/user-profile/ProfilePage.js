import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  followUser,
  getFollowStatus,
  getUserDetailsById,
  unfollowUser,
} from "../../apis/apiFollow";
import { Avatar, Button, Card, Divider, List, message, Spin } from "antd";
import "./ProfilePage.css";
import { getCollectionsDetailWithPagination } from "../../apis/api";
import { getCollectionsByUserId } from "../../apis/apiCollection";
import { formatFollowNumber } from "../util/helper";

const ProfilePage = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetailsById(id);
        // console.log("details: ", details);
        setUserDetails(details);

        const followingStatus = await getFollowStatus(id);
        setIsFollowing(followingStatus);

        const response = await getCollectionsByUserId(id, 1, 10);
        const publicCollections = response.collections.filter(
          (collection) => collection.items && collection.items.length > 0
        );
        setCollections(publicCollections);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  //   const handleFollowToggle = async () => {
  //     try {
  //       if (isFollowing) {
  //         await unfollowUser(id);
  //         message.success("Unfollowed successfully!");
  //         setIsFollowing(false);
  //       } else {
  //         await followUser(id);
  //         message.success("Followed successfully!");
  //         setIsFollowing(true);
  //       }
  //     } catch (error) {
  //       message.error("Failed to update follow status.");
  //     }
  //   };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);
        message.success("Unfollowed successfully!");
        setIsFollowing(false);
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          followersCount: Math.max(prevDetails.followersCount - 1, 0),
        }));
      } else {
        await followUser(id);
        message.success("Followed successfully!");
        setIsFollowing(true);
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          followersCount: prevDetails.followersCount + 1,
        }));
      }
    } catch (error) {
      message.error("Failed to update follow status.");
    }
  };

  if (loading) return <Spin className="profile-spin" />;

  if (!userDetails) return <div className="profile-error">User not found.</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Avatar
          shape="square"
          className="profile-avatar"
          size={200}
          src={userDetails.avatarImageLink || "/default-avatar.png"}
        />

        <div className="profile-info">
          <span className="profile-username">{userDetails.name}</span>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-number">
                {formatFollowNumber(userDetails.followersCount) || 0}
              </div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-number">
                {formatFollowNumber(userDetails.followingCount) || 0}
              </div>
              <div className="profile-stat-label">Following</div>
            </div>
          </div>
          <Button
            className={isFollowing ? "unfollow-btn" : "follow-btn"}
            onClick={handleFollowToggle}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
      {collections.length > 0 && (
        <div className="profile-collections">
          <h3 className="collections-title">Collections</h3>
          {collections.map((collection, index) => (
            <div key={collection.id} className="collection-section">
              <span className="collection-name">{collection.name}</span>
              <Divider type="horizontal" className="profile-divider" />
              <List
                // grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, column: 4 }}
                grid={{ gutter: 16, column: 4 }}
                dataSource={collection.items}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      size="small"
                      cover={
                        <div className="collection-image-container">
                          <img
                            alt={item.title}
                            src={item.imageUrl}
                            className="collection-item-image"
                          />
                        </div>
                      }
                      //   title={item.title}
                      className="collection-item-card"
                    >
                      <div className="collection-item-title">{item.title}</div>
                      {/* <p>{item.genre}</p> */}
                      {/* <p>{item.content}</p> */}
                    </Card>
                  </List.Item>
                )}
              />
              {/* <Divider type="horizontal" className="profile-divider" /> */}
              {/* {index < collections.length - 1 && (
                <div className="collection-divider">
                  <Divider />
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

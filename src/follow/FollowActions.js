import React, { useEffect, useState } from "react";
import {
  fetchDetailedFollowers,
  fetchPaginatedFollowers,
  fetchPaginatedFollowing,
  followUser,
  getCurrentUserFollowingCount,
  getFollowersCount,
  getFollowersList,
  getFollowingList,
  getFollowStatus,
  unfollowUser,
} from "../apis/apiFollow";
import { Avatar, Button, Input, message, Modal, Spin, Tooltip } from "antd";
import "./FollowActions.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Search from "antd/es/transfer/search";

const FollowActions = ({ userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [tooltipFollowersList, setTooltipFollowersList] = useState([]);
  const [tooltipFollowingList, setTooltipFollowingList] = useState([]);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const initializeFollowState = async () => {
      try {
        const count = await getFollowersCount(userId);
        setFollowersCount(count);

        const loggedInFollowingCount = await getCurrentUserFollowingCount();
        setFollowingCount(loggedInFollowingCount);

        const followingStatus = await getFollowStatus(userId);
        setIsFollowing(followingStatus);

        const followers = await getFollowersList(userId);
        setFollowersList(followers);
        setTooltipFollowersList(followers);

        const following = await getFollowingList(userId);
        setFollowingList(following);
        setTooltipFollowingList(following);

        // const followingIds = new Set(following.map((user) => user.id));
        // setFollowingUserIds(followingIds);
      } catch (error) {
        console.error("Failed to initialize follow state:", error);
      }
    };

    initializeFollowState();
  }, [userId]);

  const fetchFollowers = async (page) => {
    try {
      const data = await fetchPaginatedFollowers(userId, page, ITEMS_PER_PAGE);
      console.log("Followers API Response:", data); // Debug API response
      setFollowersList((prev) => [...prev, ...data.followers]); // Use `followers`
      setHasMoreFollowers(data.hasMore); // Use `hasMore`
    } catch (error) {
      message.error("Failed to fetch followers.");
      setHasMoreFollowers(false);
    }
  };

  const fetchFollowing = async (page) => {
    try {
      const data = await fetchPaginatedFollowing(userId, page, ITEMS_PER_PAGE);
      console.log("Following API Response:", data); // Debug API response
      setFollowingList((prev) => [...prev, ...data.following]); // Use `following`
      setHasMoreFollowing(data.hasMore); // Use `hasMore`
    } catch (error) {
      message.error("Failed to fetch following.");
      setHasMoreFollowing(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(userId);
      message.success("Followed successfully!");
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    } catch (error) {
      message.error("Failed to follow user.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
      message.success("Unfollowed successfully!");
      setIsFollowing(false);
      setFollowersCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      message.error("Failed to unfollow user.");
    }
  };

  const openFollowersModal = () => {
    setShowFollowersModal(true);
    setFollowersList([]);
    setFollowersPage(1);
    fetchFollowers(1);
  };

  const closeFollowersModal = () => {
    setShowFollowersModal(false);
  };

  const openFollowingModal = () => {
    setShowFollowingModal(true);
    setFollowingList([]);
    setFollowingPage(1);
    fetchFollowing(1);
  };

  const closeFollowingModal = () => {
    setShowFollowingModal(false);
  };

  //   console.log("followersList: ", followersList);
  return (
    <div className="follow-actions">
      <Button
        className={isFollowing ? "unfollow-btn" : "follow-btn"}
        onClick={isFollowing ? handleUnfollow : handleFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <div className="counts-container">
        <Tooltip
          title={
            tooltipFollowersList.length > 0 ? (
              <div>
                {tooltipFollowersList.map((follower, index) => (
                  <div key={index}>{follower || "Unknown"}</div> // Use a valid field
                ))}
              </div>
            ) : (
              <div>No followers</div> // Handle empty list gracefully
            )
          }
        >
          <div className="count-box" onClick={openFollowersModal}>
            <span className="count">{followersCount}</span>
            <span className="text">Followers</span>
          </div>
        </Tooltip>
        <Tooltip
          title={
            tooltipFollowingList.length > 0 ? (
              <div>
                {tooltipFollowingList.map((following, index) => (
                  <div key={index}>{following || "Unknown"}</div> // Use a valid field
                ))}
              </div>
            ) : (
              <div>No following</div> // Handle empty list gracefully
            )
          }
        >
          <div className="count-box" onClick={openFollowingModal}>
            <span className="count">{followingCount}</span>
            <span className="text">Following</span>
          </div>
        </Tooltip>
      </div>

      {/* Followers Modal */}
      <Modal
        title="Followers"
        open={showFollowersModal}
        onCancel={closeFollowersModal}
        footer={null}
        className="modal-followers"
      >
        <Search
          placeholder="Search"
          className="modal-search"
          allowClear
          onChange={(e) => console.log(e.target.value)} //add search functionality
        />
        <div id="scrollableFollowers" className="infinite-scroll-container">
          <InfiniteScroll
            dataLength={followersList.length}
            next={() => {
              setFollowersPage((prev) => prev + 1);
              fetchFollowers(followersPage + 1);
            }}
            hasMore={hasMoreFollowers}
            loader={<Spin className="infinite-scroll-loader" />}
            scrollableTarget="scrollableFollowers"
          >
            {followersList.length > 0 ? (
              followersList.map((follower, index) => (
                <div
                  key={index}
                  className="modal-item"
                  onClick={() =>
                    (window.location.href = `/user-profile/${follower.id}`)
                  }
                >
                  <Avatar
                    className="modal-avatar"
                    src={follower.avatarImageLink || "/default-avatar.png"}
                  />
                  <div className="modal-username">
                    {follower.userName || "Unknown"}
                  </div>

                  {/* <Button
                  className={
                    followingUserIds.has(follower.id)
                      ? "modal-unfollow-btn"
                      : "modal-follow-btn"
                  }
                  onClick={() => handleModalFollowToggle(follower.id, false)}
                >
                  {followingUserIds.has(follower.id) ? "Unfollow" : "Follow"}
                </Button> */}
                </div>
              ))
            ) : (
              <div>No followers found</div>
            )}
          </InfiniteScroll>
        </div>
      </Modal>

      {/* Following Modal */}
      <Modal
        title="Following"
        open={showFollowingModal}
        onCancel={closeFollowingModal}
        footer={null}
        className="modal-following"
      >
        <Search
          placeholder="Search"
          className="modal-search"
          allowClear
          onChange={(e) => console.log(e.target.value)} //add search functionality
        />
        <div id="scrollableFollowing" className="infinite-scroll-container">
          <InfiniteScroll
            dataLength={followingList.length}
            next={() => {
              setFollowingPage((prev) => prev + 1);
              fetchFollowing(followingPage + 1);
            }}
            hasMore={hasMoreFollowing}
            loader={<Spin className="infinite-scroll-loader" />}
            scrollableTarget="scrollableFollowing"
          >
            {followingList.length > 0 ? (
              followingList.map((following, index) => (
                <div
                  key={index}
                  className="modal-item"
                  onClick={() =>
                    (window.location.href = `/user-profile/${following.id}`)
                  }
                >
                  <Avatar
                    className="modal-avatar"
                    src={following.avatarImageLink || "/default-avatar.png"}
                  />
                  <div className="modal-username">
                    {following.userName || "Unknown"}
                  </div>
                  {/* <Button
                  className={
                    followingUserIds.has(following.id)
                      ? "modal-unfollow-btn"
                      : "modal-follow-btn"
                  }
                  onClick={() => handleModalFollowToggle(following.id, true)}
                >
                  {followingUserIds.has(following.id) ? "Unfollow" : "Follow"}
                </Button> */}
                </div>
              ))
            ) : (
              <div>No following found</div>
            )}
          </InfiniteScroll>
        </div>
      </Modal>
    </div>
  );
};

export default FollowActions;

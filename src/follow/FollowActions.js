import React, { useEffect, useState } from "react";
import {
  fetchDetailedFollowers,
  fetchPaginatedFollowers,
  fetchPaginatedFollowing,
  followUser,
  getCurrentUserFollowingCount,
  getFollowersCount,
  getFollowersList,
  getFollowingCount,
  getFollowingList,
  getFollowStatus,
  unfollowUser,
} from "../apis/apiFollow";
import { Avatar, Button, Input, message, Modal, Spin, Tooltip } from "antd";
import "./FollowActions.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Search from "antd/es/transfer/search";
import { formatFollowNumber } from "../components/util/helper";
import TooltipWrapper from "../components/util/TooltipWrapper";

const FollowActions = ({ userId, isGuest }) => {
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
  const [isMobile, setIsMobile] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // detect if the device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const initializeFollowState = async () => {
      try {
        const count = await getFollowersCount(userId);
        setFollowersCount(count);

        // const loggedInFollowingCount = await getCurrentUserFollowingCount();
        // setFollowingCount(loggedInFollowingCount);

        const followingCount = await getFollowingCount(userId);
        setFollowingCount(followingCount);

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
      console.log(`Fetching followers - Page: ${page}`);

      const data = await fetchPaginatedFollowers(userId, page, ITEMS_PER_PAGE);
      console.log("Followers API Response:", data); // Debug API response

      if (data.followers.length > 0) {
        setFollowersList((prev) => [...prev, ...data.followers]);

        const more = data.hasMore;
        console.log(`Setting hasMoreFollowers to: ${more}`);
        setHasMoreFollowers(more);
      } else {
        setHasMoreFollowers(false);
      }
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
    setHasMoreFollowers(true);
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

  // console.log("followersList: ", followersList);
  // console.log("hasmore: ", hasMoreFollowers);
  return (
    <div className="follow-actions">
      {/* <Tooltip title={isGuest ? "Register or Login to follow" : ""}>
        <Button
          disabled={isGuest}
          className={isFollowing ? "unfollow-btn" : "follow-btn"}
          onClick={isFollowing ? handleUnfollow : handleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </Tooltip> */}

      <TooltipWrapper
        tooltipContent={isGuest ? "Register or Login to follow" : ""}
        isDisabled={isGuest}
      >
        <Button
          disabled={isGuest}
          className={isFollowing ? "unfollow-btn" : "follow-btn"}
          onClick={isFollowing ? handleUnfollow : handleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </TooltipWrapper>
      <div className="counts-container">
        <Tooltip
          title={
            !isMobile &&
            (!isGuest ? (
              tooltipFollowersList.length > 0 ? (
                <div>
                  {tooltipFollowersList.map((follower, index) => (
                    <div key={index}>{follower || "Unknown"}</div> // Use a valid field
                  ))}
                </div>
              ) : (
                <div>No followers</div> // Handle empty list gracefully
              )
            ) : (
              ""
            ))
          }
        >
          {isGuest ? (
            <div className="count-box">
              <span className="count">{formatFollowNumber(1200000)}</span>
              <span className="text">Followers</span>
            </div>
          ) : (
            <div className="count-box" onClick={openFollowersModal}>
              <span className="count">
                {formatFollowNumber(followersCount)}
              </span>
              <span className="text">Followers</span>
            </div>
          )}
        </Tooltip>

        <Tooltip
          title={
            !isMobile &&
            (!isGuest ? (
              tooltipFollowingList.length > 0 ? (
                <div>
                  {tooltipFollowingList.map((following, index) => (
                    <div key={index}>{following || "Unknown"}</div> // Use a valid field
                  ))}
                </div>
              ) : (
                <div>No following</div> // Handle empty list gracefully
              )
            ) : (
              ""
            ))
          }
        >
          {isGuest ? (
            <div className="count-box">
              <span className="count">{formatFollowNumber(12500)}</span>
              <span className="text">Following</span>
            </div>
          ) : (
            <div className="count-box" onClick={openFollowingModal}>
              <span className="count">
                {formatFollowNumber(followingCount)}
              </span>
              <span className="text">Following</span>
            </div>
          )}
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
          disabled
          onChange={(e) => console.log(e.target.value)} //add search functionality
        />
        <div id="scrollableFollowers" className="infinite-scroll-container">
          <InfiniteScroll
            key={followersList.length}
            dataLength={followersList.length}
            next={() => {
              const nextPage = followersPage + 1;
              setFollowersPage(nextPage);
              fetchFollowers(nextPage);
            }}
            hasMore={hasMoreFollowers}
            // loader={<Spin className="infinite-scroll-loader" />}
            loader={
              <div style={{ textAlign: "center", padding: "10px" }}>
                <Spin />
              </div>
            }
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
        className="modal-followers"
      >
        <Search
          placeholder="Search"
          className="modal-search"
          allowClear
          disabled
          onChange={(e) => console.log(e.target.value)} //add search functionality
        />
        <div id="scrollableFollowing" className="infinite-scroll-container">
          <InfiniteScroll
            dataLength={followingList.length}
            next={() => {
              const nextPage = followingPage + 1;
              setFollowingPage(nextPage);
              fetchFollowing(nextPage);
            }}
            hasMore={hasMoreFollowing}
            // loader={<Spin className="infinite-scroll-loader" />}
            loader={
              <div style={{ textAlign: "center", padding: "10px" }}>
                <Spin />
              </div>
            }
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

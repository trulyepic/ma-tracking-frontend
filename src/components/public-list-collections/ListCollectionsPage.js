import React, { useEffect, useState } from "react";
import {
  getPublicCollections,
  getPublicGuestCollections,
  getPublicToken,
  getUserDetails,
  likeCollection,
  likeItem,
  unlikeCollection,
  unlikeItem,
} from "../../apis/api";
import { Avatar, Button, List, message, Pagination } from "antd";
import "./ListCollectionsPage.css";
import moment from "moment";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const ListCollectionsPage = () => {
  const navigate = useNavigate();

  const [publicUsers, setPublicUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userDetails = await getUserDetails();
          setCurrentUserId(userDetails.id); // Store current user ID
        } catch (error) {
          localStorage.removeItem("authToken");
          console.error("Failed to fetch user details:", error);
        }
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchPublicUsers = async () => {
      try {
        // let token = localStorage.getItem("authToken");

        // if (!token) {
        //   // Fetch the public token if no auth token is available
        //   token = await getPublicToken();
        //   localStorage.setItem("authToken", token);
        // }
        const token = localStorage.getItem("authToken");
        console.log("token in list: ", token);
        const users = token
          ? await getPublicCollections()
          : await getPublicGuestCollections();
        // const users = await getPublicCollections();
        // setPublicUsers(users);
        // setPublicUsers(
        //   users.map((user) => ({ ...user, likes: user.likes || 0 }))
        // ); // Ensure likes field exists

        // Ensure `likesCount` exists and is accurate
        // setPublicUsers(
        //   users.map((user) => ({
        //     ...user,
        //     likesCount: user.likesCount || 0,
        //     liked: token ? user.liked : false, // Guests cannot "like"
        //     isOwner: token && currentUserId === user.id,
        //   }))
        // );
        const mappedUsers = users.map((user) => ({
          ...user,
          likesCount: user.likesCount || 0,
          liked: token ? user.liked : false,
          isOwner: token && currentUserId === user.id,
        }));

        // sort to place the logged-in user's collection at the top
        const sortedUsers = mappedUsers.sort((a, b) => {
          if (a.isOwner && !b.isOwner) return -1;
          if (!a.isOwner && b.isOwner) return 1;
          return 0; // maintain order for other users
        });

        setPublicUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching public collections:", error);
        message.error("Failed to fetch public collections.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicUsers();
  }, [currentUserId]);

  //   const handleLikeToggle = async (user) => {
  //     console.log("user in list collection: ", user);
  //   };

  const handleLikeToggle = async (user) => {
    console.log("user: ", user);

    const token = localStorage.getItem("authToken");
    if (!token) {
      message.info("Please log in to like a collection.");
      return;
    }
    try {
      if (user.liked) {
        await unlikeCollection(user.id);
        setPublicUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  liked: false,
                  likesCount: Math.max(0, u.likesCount - 1),
                }
              : u
          )
        );
      } else {
        await likeCollection(user.id);
        setPublicUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, liked: true, likesCount: u.likesCount + 1 }
              : u
          )
        );
      }
    } catch (error) {
      console.error(
        "Error toggling like:",
        error.response?.data || error.message
      );
      message.error("Failed to toggle like. Please try again.");
    }
  };

  const formatTimeAgo = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  // Navigate with isOwner
  const navigateToUserHomePage = (user) => {
    // console.log("user in list collection: ", user);
    navigate(`/collection-homepage/${user.id}`, {
      state: {
        listUserDetails: user,
        isGuest: !localStorage.getItem("authToken"),
        isOwner: currentUserId === user.id, // Pass ownership
      },
    });
  };

  // calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = publicUsers.slice(startIndex, endIndex);

  return (
    <div className="list-collections-page">
      <Helmet>
        <title>Public Collections | Ex-hibit</title>
        <meta
          name="description"
          content="Explore public collections shared by the community. 
          Like, view, and navigate various collections."
        />
        <meta
          name="keywords"
          content="collections, public, browse, share, social, social media,
        cool, manhwa, manga, like"
        />
        <meta property="og:title" content="Public Collections | Ex-hibit" />
        <meta
          property="og:description"
          content="Explore collections shared by the community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />
      </Helmet>
      <h1 className="list-collection-header">Public Collections</h1>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={paginatedUsers}
        renderItem={(user) => (
          <List.Item className="list-card">
            <List.Item.Meta
              avatar={
                <Avatar
                  src={user.avatarImageLink}
                  size="large"
                  shape="square"
                />
              }
              title={
                <span
                  className="list-item-title"
                  // onClick={() =>
                  //   navigate(`/user-homepage/${user.id}`, {
                  //     state: { listUserDetails: user },
                  //   })
                  // }
                  onClick={() => navigateToUserHomePage(user)}
                  //   href={`/user-homepage/${user.id}`}
                >{`${user.userName} Collections`}</span>
              }
              description={
                <div className="list-card-content">
                  <span>{`Created: ${new Date(
                    user.publicViewCreatedDate
                  ).toLocaleString()}`}</span>
                  <span className="time-ago">
                    {formatTimeAgo(user.publicViewCreatedDate)}
                  </span>
                </div>
              }
            />
            <div className="like-section">
              <Button
                type="text"
                icon={
                  user.liked ? (
                    <HeartFilled style={{ color: "red" }} />
                  ) : (
                    <HeartOutlined style={{ color: "white" }} />
                  )
                }
                onClick={() => handleLikeToggle(user)}
                // disabled={processingLikes[user.id]} // Disable while processing
              />
              <span>{user.likesCount || 0}</span>
            </div>
          </List.Item>
        )}
      />
      <Pagination
        size="large"
        current={currentPage}
        pageSize={pageSize}
        total={publicUsers.length}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        showSizeChanger
      />
    </div>
  );
};

export default ListCollectionsPage;

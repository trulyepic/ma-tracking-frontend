import React, { useEffect, useRef, useState } from "react";
import "./UserHomePage.css";
import { Button, Divider, Dropdown, Input, message, Switch } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  deleteUserItem,
  getCollectionsDetailWithPagination,
  getCollectionsDetailWithPaginationId,
  getGuestItemsWithPagination,
  getUserDetails,
  getUserDetailsById,
  togglePublicView,
} from "../apis/api";
import UserCollectionGrid from "./item-holder/UserCollectionGrid";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { withTooltip } from "./util/helper";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const { Search } = Input;

const useResolvedId = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const { state } = location || {};
  const { userDetails } = state || {};
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        const userDetails = await getUserDetails();
        setAuthenticatedUser(userDetails);
        // localStorage.setItem("userId", userDetails.id);
      } catch (error) {
        console.warn("Failed to fetch authenticated user details.", error);
      }
    };

    fetchAuthenticatedUser();
  }, []);
  // const resolvedId = paramId || userDetails?.id;

  // return resolvedId;
  return paramId || userDetails?.id || authenticatedUser?.id;
};
const UserHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const listUserDetails = state?.listUserDetails;

  const id = useResolvedId();
  const userIdRef = useRef(null);

  const [sortLabel, setSortLabel] = useState("Sort By Ratings");
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSort, setSelectedSort] = useState("");
  const [page, setPage] = useState(1); // Track current page
  const [userName, setUserName] = useState("User");
  const [isGuest, setIsGuest] = useState(false);
  const [publicView, setPublicView] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const ITEMS_PER_PAGE = 20; // Define items per page (matches API limit)

  useEffect(() => {
    const validateOwnership = async () => {
      try {
        const userDetails = await getUserDetails();
        // const userID2 = localStorage.getItem("userId")
        // console.log("userDetails test: ", userDetails);
        const ownerStatus = userDetails.id === Number(id);
        setIsOwner(ownerStatus);
        // setIsOwner(userDetails.id === Number(id));
        if (ownerStatus) {
          await fetchPaginationData(1, true); // Reset items for the owner
        }
      } catch (error) {
        console.warn("Error validating ownership:", error);
      }
    };

    validateOwnership();
  }, [id, location]);

  useEffect(() => {
    const fetchPublicViewStatus = async () => {
      try {
        const userDetails = await getUserDetails();
        setPublicView(userDetails.publicView || false);
        setUserData(userDetails);

        //check if the athenticated user matches the collection owner
        setIsOwner(userDetails.id === Number(id));
        // setOwnerId(userDetails.id);
      } catch (error) {
        // console.error("Error fetching user details:", error);
        console.warn(
          "Unable to fetch user details. User may not be logged in.",
          error
        );
      }
    };

    fetchPublicViewStatus();
  }, []);

  useEffect(() => {
    const initializePage = async () => {
      console.log("initializing user and fetching data...");
      await fetchUserName();
    };

    initializePage();
  }, []);

  useEffect(() => {
    if (isGuest !== null) {
      console.log("Fetching data for:", isGuest ? "guest" : "logged-in user");
      fetchMoreData();
    }
  }, [isGuest]);

  const fetchUserName = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUserName("Guest");
      setIsGuest(true);
      setPage(1); // Reset page for guest
      return;
    }
    try {
      const userDetails = await getUserDetails();
      setUserName(userDetails.name);
      setIsGuest(false);
      setPage(1);
    } catch (error) {
      console.error("Failed to fetch user name:", error);
      setUserName("Guest"); // Fallback in case of error
      setIsGuest(true);
      setPage(1);
    }
  };

  const fetchPaginationData = async (pageNumber = 1, resetItems = false) => {
    // console.log("Fetching data for user ID:", id);
    //todo: use localstorage so the api is not called every time a user reloads the page

    // console.log("isGuest:", isGuest);
    // console.log("Fetching page:", pageNumber, "with limit:", ITEMS_PER_PAGE);
    try {
      let response;
      if (isGuest && !id) {
        // Fetch guest items if user is a guest and no ID is specified
        response = await getGuestItemsWithPagination(
          pageNumber,
          ITEMS_PER_PAGE
        );
      } else if (id) {
        // fetch collections for a specific user ID
        response = await getCollectionsDetailWithPaginationId(
          pageNumber,
          ITEMS_PER_PAGE,
          id
        );
      } else {
        // default behaviour for logged-in user's own items
        response = await getCollectionsDetailWithPagination(
          pageNumber,
          ITEMS_PER_PAGE
        );
      }

      // const fetchFunction = isGuest
      //   ? getGuestItemsWithPagination
      //   : getCollectionsDetailWithPagination;

      // const response = await fetchFunction(pageNumber, ITEMS_PER_PAGE);
      const newItems = response.items;
      const totalItems = newItems.totalItems;

      if (resetItems) {
        setItems(newItems);
        setPage(2);
        // setHasMore(newItems.length === ITEMS_PER_PAGE);
        setHasMore(newItems < totalItems);
      } else {
        //append new items to the existing list
        setItems((prevItems) => {
          const uniqueItems = newItems.filter(
            (newItem) => !prevItems.some((item) => item.id === newItem.id)
          );
          return [...prevItems, ...uniqueItems];
        });
        // if (newItems.length === ITEMS_PER_PAGE) {
        //   setPage(pageNumber + 1);
        // } else {
        //   setHasMore(false);
        // }
        setPage((prevPage) => prevPage + 1); // move to the next page for the next load
        setHasMore(newItems.length === ITEMS_PER_PAGE); // enable or disable infinite scroll
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setHasMore(false);
    }
  };

  const fetchMoreData = async () => {
    console.log("Fetching more data page:", page);
    fetchPaginationData(page);
  };

  const filteredItems = selectedSort
    ? items.filter((item) => {
        const genre = item.genre.toLowerCase();
        const selectedGenre = selectedSort.toLowerCase();
        return genre.includes(selectedGenre);
      })
    : items; //show all items if no filter is selected

  const uniqueGenres = Array.from(
    new Set(
      items.flatMap((item) => item.genre.split(", ").map((g) => g.trim()))
    )
  );

  const menuProps = {
    items: [
      {
        key: "1",
        value: "Collections",
        icon: "fas fa-th-large",
      },
      {
        key: "2",
        value: "List",
        icon: "fas fa-th-list",
      },
    ],
    onSelect: (item) => {
      console.log(item);
    },
  };

  const handleSortChange = (sortType) => {
    // Toggle the filter off if the same button is clicked twice
    setSelectedSort((prevSort) => (prevSort === sortType ? "" : sortType));
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteUserItem(itemId);

      // remove the item from the state
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleTogglePublicView = async (checked) => {
    try {
      const collectionLink =
        window.location.href + `user-homepage/${userData.id}`;
      const response = await togglePublicView(checked, collectionLink);
      setPublicView(checked);
      message.success(response);
      console.log("collection link: ", collectionLink);
    } catch (error) {
      console.error("Error toggling public view:", error);
      message.error("Failed to update public view setting.");
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // console.log("has more  : ", hasMore);
  // console.log("user homepage state: ", state);
  // console.log("isGuest in home: ", isGuest);
  // console.log("isOwner in home: ", isOwner);
  return (
    <div>
      <div className="user-home-page-container">
        {isGuest && (
          <div className="user-home-main-header">
            <h1>Welcome to Ma-Trac.</h1>
            <span className="suer-home-main-sub-txt">
              Start creating your collections now!
            </span>
          </div>
        )}
        <header className="user-home-page-header">
          <h1 className="user-home-page-title">
            {listUserDetails
              ? `${listUserDetails.userName}'s Collections`
              : `${userName}'s Collections`}
          </h1>
          <div className="user-home-page-search-dropdown">
            <Search
              className="user-home-search-input"
              size="large"
              placeholder="Search collections"
              allowClear
            />
            {/* todo: might implement this later */}
            {/* <Dropdown.Button
              menu={menuProps}
              size="large"
              trigger={["click"]}
              className="user-home-dropdown"
            ></Dropdown.Button> */}

            <div className="right-controls">
              <div style={{ marginBottom: "20px" }}>
                <label style={{ marginRight: "10px" }}>
                  Allow Public View:
                </label>
                {withTooltip(
                  <Switch
                    checked={publicView}
                    onChange={handleTogglePublicView}
                    disabled={isGuest || !isOwner}
                  />,
                  isGuest || !isOwner,
                  isGuest
                )}
              </div>
              {withTooltip(
                <Button size="large" disabled={isGuest || !isOwner}>
                  <span className="user-home-add-btn">Add Collection</span>
                </Button>,
                isGuest || !isOwner,
                isGuest
              )}
            </div>
          </div>
          <div className="filters">
            <div className="sort-buttons">
              Sort By:{" "}
              {uniqueGenres.map((genre) => (
                <button
                  key={genre}
                  className={selectedSort === genre ? "active" : " "}
                  onClick={() => handleSortChange(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <span className="collection-name-header">Collection Name</span>

          <div
            className="divider-container"
            // className={`divider-container ${isCollapsed ? "collapsed" : ""}`}
          >
            <Divider
              className={`custom-divider ${isCollapsed ? "collapsed" : ""}`}
              onClick={toggleCollapse}
            >
              <div className="actions-container">
                <Button
                  type="primary"
                  className="add-item-collection"
                  onClick={() => navigate("/additem")}
                >
                  Add Item
                </Button>
              </div>
            </Divider>
            {/* <Button
              type="text"
              icon={isCollapsed ? <UpOutlined /> : <DownOutlined />}
              onClick={toggleCollapse}
              className="toggle-button"
              size="large"
            /> */}
          </div>
        </header>
        {!isCollapsed && (
          <InfiniteScroll
            dataLength={filteredItems.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <UserCollectionGrid
              items={filteredItems}
              onDelete={handleDeleteItem} //pass isGuest to disable delete and edit for guest
              isOwner={isOwner}
              isGuest={isGuest}
            />
            {/* {hasMore && (
          <Button
            type="primary"
            onClick={fetchMoreData}
            className="user-home-load-btn"
          >
            {" "}
            Load more items
          </Button>
        )} */}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default UserHomePage;

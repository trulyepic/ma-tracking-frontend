import React, { useEffect, useRef, useState } from "react";
import "./UserHomePage.css";
import { Button, Divider, Input, message, Modal, Switch } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  deleteUserItem,
  getUserDetails,
  searchUserCollections,
  togglePublicView,
} from "../apis/api";
import UserCollectionGrid from "./item-holder/UserCollectionGrid";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { showConfirmModal, withTooltip } from "./util/helper";
import {
  deleteCollection,
  deleteItemFromCollection,
  getCollectionItems,
  getCollections,
  getCollectionsByUserId,
  getGuestCollectionsWithPaginationMa,
} from "../apis/apiCollection";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import CookieConsent from "./cookies/CookieConsent";
import FollowActions from "../follow/FollowActions";

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
      } catch (error) {
        console.warn("Failed to fetch authenticated user details.", error);
      }
    };

    fetchAuthenticatedUser();
  }, []);

  return userDetails?.id || paramId || authenticatedUser?.id;
};
const CollectionHomePage = () => {
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
  const [collections, setCollections] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState([]);

  const ITEMS_PER_PAGE = 10; // Define items per page (matches API limit)

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsGuest(true);
        setPage(1);
        return;
      }
      try {
        await getUserDetails();
        setIsGuest(false);
        setPage(1);
      } catch {
        setIsGuest(true);
        setPage(1);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [id, page, isGuest]);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Fetch authenticated user details to check ownership
      // let authenticatedUser = null;
      // if (token) {
      //   try {
      //     authenticatedUser = await getUserDetails();
      //   } catch (error) {
      //     console.warn("Failed to fetch authenticated user details:", error);
      //   }
      // }

      // Determine if the current user is the owner
      const isCurrentUser = userData && userId === Number(id);
      let collectionData;

      if (isGuest && !id) {
        // Fetch guest collections with items
        collectionData = await getGuestCollectionsWithPaginationMa(
          page,
          ITEMS_PER_PAGE
        );
      } else if (!isCurrentUser) {
        // Logged-in user viewing another user's collections
        // console.log("!isCurrentUser = ", !isCurrentUser);
        const response = await getCollectionsByUserId(id, page, ITEMS_PER_PAGE);
        collectionData = response.collections || []; // Extract collections
      } else {
        // Fetch collections for a logged-in user
        const rawCollections = await getCollections();

        // Check if the user navigated from ListCollectionsPage
        const isNavigated =
          location.state?.listUserDetails || location.state?.isGuest;

        const storedCollapseState =
          JSON.parse(localStorage.getItem("collapsedCollections")) || {};
        // Populate each collection with its items
        collectionData = await Promise.all(
          rawCollections.map(async (collection) => {
            const itemsResponse = await getCollectionItems(
              collection.id,
              1,
              ITEMS_PER_PAGE
            );
            return {
              ...collection,
              items: itemsResponse.items || [], // Populate items
              collapsed: isNavigated
                ? true
                : storedCollapseState[collection.id] ?? true, // Ensure collapsed state is added
              // collapsed: isNavigated
              //   ? true
              //   : JSON.parse(localStorage.getItem("collapsedCollections"))?.[
              //       collection.id
              //     ] ?? true,
              hasMore: itemsResponse.totalItems > itemsResponse.items.length, // Check if more items exist
              page: 2, // Next page to fetch
            };
          })
        );
      }

      if (Array.isArray(collectionData)) {
        setCollections(collectionData);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
      //   message.error("Failed to fetch collections.");
    }
  };

  //   const fetchCollectionItems = async (collectionId, pageNumber) => {
  //     try {
  //       const response = await getCollectionItems(
  //         collectionId,
  //         pageNumber,
  //         ITEMS_PER_PAGE
  //       );
  //       const newItems = response.items;
  //       setCollections((prevCollections) =>
  //         prevCollections.map((collection) => {
  //           if (collection.id === collectionId) {
  //             return {
  //               ...collection,
  //               items: [...collection.items, ...newItems], // Append new items
  //               page: pageNumber + 1, // Update page for this collection
  //               hasMore: newItems.length === ITEMS_PER_PAGE, // Update hasMore
  //             };
  //           }
  //           return collection;
  //         })
  //       );
  //     } catch (error) {
  //       console.error("Error fetching collection items:", error);
  //       message.error("Failed to load collection items.");
  //     }
  //   };

  const handleAddCollection = () => {
    navigate("/addcollection");
  };

  useEffect(() => {
    const fetchPublicViewStatus = async () => {
      try {
        if (!isGuest) {
          const userDetails = await getUserDetails();
          setPublicView(userDetails.publicView || false);
          setUserData(userDetails);
          // setUserName(userDetails.name);
          //check if the athenticated user matches the collection owner
          setIsOwner(userDetails.id === Number(id));
          // console.log("!isGuest = ", !isGuest);
        }
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
  }, [id]);

  useEffect(() => {
    const initializePage = async () => {
      // console.log("initializing user and fetching data...");
      await fetchUserName();
    };
    if (!isGuest) {
      initializePage();
    }
  }, [isGuest]);

  //   useEffect(() => {
  //     if (isGuest !== null) {
  //       console.log("Fetching data for:", isGuest ? "guest" : "logged-in user");
  //       fetchMoreData();
  //     }
  //   }, [isGuest]);

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
      setUserId(userDetails.id);
    } catch (error) {
      console.error("Failed to fetch user name:", error);
      setUserName("Guest"); // Fallback in case of error
      setIsGuest(true);
      setPage(1);
    }
  };

  // Filter collections based on selected genre
  const filteredCollections = collections.map((collection) => ({
    ...collection,
    items: selectedSort
      ? collection.items
          .filter((item) =>
            item.genre.toLowerCase().includes(selectedSort.toLowerCase())
          )
          .sort((a, b) => a.title.localeCompare(b.title)) // sort alphabetically
      : collection.items.sort((a, b) => a.title.localeCompare(b.title)), // Default sort
  }));

  const uniqueGenres = Array.from(
    new Set(
      collections.flatMap((collection) =>
        collection.items.flatMap((item) =>
          item.genre.split(",").map((g) => g.trim())
        )
      )
    )
  );

  const handleSortChange = (sortType) => {
    // Toggle the filter off if the same button is clicked twice
    setSelectedSort((prevSort) => (prevSort === sortType ? "" : sortType));
  };

  //   const handleDeleteItem = async (itemId) => {
  //     try {
  //       await deleteUserItem(itemId);

  //       // remove the item from the state
  //       setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  //     } catch (error) {
  //       console.error("Error deleting item:", error);
  //       alert("Failed to delete item. Please try again.");
  //     }
  //   };

  const handleDeleteItem = (collectionId, itemId) => {
    // console.log("collection id from home page; ", collectionId);
    // console.log("itemId from home page:", itemId);
    showConfirmModal(
      "Are you sure you want to delete this item?",
      <span className="del-confirm-mod">This action cannot be undone.</span>,
      async () => {
        try {
          await deleteItemFromCollection(collectionId, itemId);

          // Remove the item from the state
          setCollections((prevCollections) =>
            prevCollections.map((collection) => {
              if (collection.id === collectionId) {
                return {
                  ...collection,
                  items: collection.items.filter((item) => item.id !== itemId),
                };
              }
              return collection;
            })
          );
          message.success("Item deleted successfully.");
        } catch (error) {
          console.error("Error deleting item:", error);
          message.error("Failed to delete item. Please try again.");
        }
      }
    );
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await deleteCollection(collectionId);

      //remove the collection from the state
      setCollections((prevCollections) =>
        prevCollections.filter((collection) => collection.id !== collectionId)
      );
      message.success("Collection deleted successfully.");
    } catch (error) {
      console.error("Error deleting collection:", error);
      message.error("Failed to delete collection. Please try again.");
    }
  };

  const confirmDeleteCollection = (collectionId) => {
    Modal.confirm({
      title:
        "Are you sure you want to delete this collection and all it's items?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      className: "del-col ",
      onOk: () => {
        handleDeleteCollection(collectionId);
      },
    });
  };

  const handleTogglePublicView = async (checked) => {
    try {
      const collectionLink =
        window.location.href + `collection-homepage/${userData.id}`;
      const response = await togglePublicView(checked, collectionLink);
      setPublicView(checked);
      message.success(response);
      console.log("collection link: ", collectionLink);
    } catch (error) {
      console.error("Error toggling public view:", error);
      message.error("Failed to update public view setting.");
    }
  };

  const handleLoadMoreItems = async (collectionId) => {
    const targetCollection = collections.find((c) => c.id === collectionId);
    if (!targetCollection || !targetCollection.hasMore) return;

    try {
      const response = await getCollectionItems(
        collectionId,
        targetCollection.page,
        ITEMS_PER_PAGE
      );

      setCollections((prevCollections) =>
        prevCollections.map((collection) => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              items: [...collection.items, ...response.items], // Append new items
              page: collection.page + 1, // Increment page number
              hasMore: response.items.length === ITEMS_PER_PAGE, // Update hasMore
            };
          }
          return collection;
        })
      );
    } catch (error) {
      console.error("Error loading more items:", error);
      message.error("Failed to load more items.");
    }
  };

  // const handleToggleCollapse = async (collectionId) => {
  //   setCollections((prevCollections) =>
  //     prevCollections.map((collection) => {
  //       if (collection.id === collectionId) {
  //         return { ...collection, collapsed: !collection.collapsed };
  //       }
  //       return collection;
  //     })
  //   );
  // };
  const handleToggleCollapse = (collectionId) => {
    setCollections((prevCollections) => {
      const updatedCollections = prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          return { ...collection, collapsed: !collection.collapsed };
        }
        return collection;
      });

      // Save collapsed state in localStorage
      const collapseState = updatedCollections.reduce((acc, collection) => {
        acc[collection.id] = collection.collapsed;
        return acc;
      }, {});

      localStorage.setItem(
        "collapsedCollections",
        JSON.stringify(collapseState)
      );

      return updatedCollections;
    });
  };

  const handleAddItem = (collectionId) => {
    navigate("/additem", { state: { collectionId } });

    // After navigating and adding the item, fetch the updated items
    // fetchCollectionItems(collectionId, 1);
  };

  const handleRenameCollection = (collectionId, collectionName) => {
    navigate("/addCollection", {
      state: {
        mode: "update",
        collectionId,
        collectionName,
      },
    });
  };

  // const handleSearch = async (value) => {
  //   setSearchQuery(value);
  //   if (!value) {
  //     setSearchResults([]);
  //     return;
  //   }

  //   try {
  //     const results = await searchUserCollections(id, value);
  //     setSearchResults(results);
  //   } catch (error) {
  //     console.error("Error searching collections:", error);
  //     message.error("Failed to search collections.");
  //   }
  // };
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   if (!query) {
  //     setFilteredCollections(collections);
  //   } else {
  //     const lowerQuery = query.toLowerCase();
  //     const filtered = collections.filter((collection) =>
  //       collection.name.toLowerCase().includes(lowerQuery)
  //     );
  //     setFilteredCollections(filtered);
  //   }
  // };

  // console.log("has more  : ", hasMore);
  // console.log("user homepage state: ", state);
  // console.log("isGuest in home: ", isGuest);
  // console.log("isOwner in home: ", isOwner);
  // console.log("Collections:", collections);

  // console.log("home isguest: ", isGuest);
  return (
    <div>
      <div className="user-home-page-container">
        <CookieConsent />
        {isGuest && (
          <div className="user-home-main-header">
            <span className="home-header-txt">Welcome to Ex-hibit</span>
            <span className="home-main-sub-txt">
              Start creating your collections now
            </span>
            <span className="home-and">&</span>
            <span className="home-sub-txt">
              Explore the public collections from other users!
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
            <FollowActions userId={id} isGuest={isGuest} />
            {/* <Button>follow</Button>
            <span>following</span>
            <span>followers</span> */}
            {/* <Search
              className="user-home-search-input"
              size="large"
              placeholder="Search collections"
              allowClear
              onSearch={handleSearch}
            /> */}

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
                <Button
                  size="large"
                  disabled={isGuest || !isOwner}
                  onClick={handleAddCollection}
                >
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
        </header>
        {/* Render collections dynamically */}
        {filteredCollections.map((collection) => (
          <div key={collection.id} className="collection-section">
            <div className="collection-name-header">
              {withTooltip(
                <Button
                  type="primary"
                  onClick={() => handleAddItem(collection.id)}
                  disabled={isGuest || !isOwner}
                  className="add-item-collection"
                >
                  Add Item
                </Button>,
                isGuest || !isOwner,
                isGuest
              )}
              <div
                className="collection-name-center"
                onClick={() =>
                  handleToggleCollapse(
                    collection.id || collection.collectionName
                  )
                }
              >
                <span className="collection-name-text">
                  {collection.name || "Unnamed Collection"}
                  {collection.collapsed ? <UpOutlined /> : <DownOutlined />}
                </span>
              </div>

              {/* will impl in the future. every item
                 image url will also need to be renamed */}
              {isVisible && (
                <Button
                  type="default"
                  className="add-item-collection"
                  onClick={() =>
                    handleRenameCollection(collection.id, collection.name)
                  }
                >
                  Rename Collection name
                </Button>
              )}
              {withTooltip(
                <Button
                  type="default"
                  // danger
                  className="delete-col-btn"
                  disabled={isGuest || !isOwner}
                  onClick={() => confirmDeleteCollection(collection.id)}
                >
                  Delete Collection
                </Button>,
                isGuest || !isOwner,
                isGuest
              )}
            </div>
            <Divider
              variant="solid"
              className={`custom-divider ${
                collection.collapsed ? "collapsed" : ""
              }`}
              onClick={() =>
                handleToggleCollapse(collection.id || collection.collectionName)
              }
            ></Divider>

            {!collection.collapsed && (
              <div className="collection-container">
                <InfiniteScroll
                  dataLength={collection?.items?.length || 0}
                  next={() => handleLoadMoreItems(collection.id)}
                  hasMore={collection?.hasMore || false}
                  //   loader={<h4>Loading...</h4>}
                >
                  <UserCollectionGrid
                    items={collection?.items || []}
                    onDelete={(itemId) =>
                      handleDeleteItem(collection.id, itemId)
                    }
                    isOwner={isOwner}
                    isGuest={isGuest}
                    collectionId={collection.id}
                  />
                </InfiniteScroll>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionHomePage;

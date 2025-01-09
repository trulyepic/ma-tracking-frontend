import React, { useEffect, useState } from "react";
import "./UserHomePage.css";
import { Button, Dropdown, Input } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  deleteUserItem,
  getCollectionsDetailWithPagination,
  getGuestItemsWithPagination,
  getUserDetails,
} from "../apis/api";
import UserCollectionGrid from "./item-holder/UserCollectionGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const UserHomePage = () => {
  const navigate = useNavigate();
  const [sortLabel, setSortLabel] = useState("Sort By Ratings");
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSort, setSelectedSort] = useState("");
  const [page, setPage] = useState(1); // Track current page
  const [userName, setUserName] = useState("User");
  const [isGuest, setIsGuest] = useState(false);

  const ITEMS_PER_PAGE = 20; // Define items per page (matches API limit)

  // useEffect(() => {
  //   fetchUserName();
  //   fetchMoreData();
  // }, []);

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
    //todo: use localstorage so the api is not called every time a user reloads the page

    console.log("isGuest:", isGuest);
    console.log("Fetching page:", pageNumber, "with limit:", ITEMS_PER_PAGE);
    try {
      const fetchFunction = isGuest
        ? getGuestItemsWithPagination
        : getCollectionsDetailWithPagination;

      const response = await fetchFunction(pageNumber, ITEMS_PER_PAGE);
      const newItems = response.items;
      const totalItems = newItems.totalItems;

      // const newItems = await getCollectionsDetailWithPagination(
      //   pageNumber,
      //   ITEMS_PER_PAGE
      // );
      // console.log("items from api:", totalItems);
      // console.log("response: ", response);
      // console.log("newItems : ", newItems);
      // console.log("response totalitems: ", response.totalItems);
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
  console.log("has more  : ", hasMore);
  return (
    <div>
      <div className="user-home-page-container">
        <header className="user-home-page-header">
          <h1 className="user-home-page-title">{userName}'s collections</h1>
          <div className="user-home-page-search-dropdown">
            <Search
              className="user-home-search-input"
              size="large"
              placeholder="Search collections"
              allowClear
            />
            <Dropdown.Button
              menu={menuProps}
              size="large"
              trigger={["click"]}
              className="user-home-dropdown"
            ></Dropdown.Button>

            <Button size="large" onClick={() => navigate("/additem")}>
              <span className="user-home-add-btn">Add item</span>
            </Button>
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

        <InfiniteScroll
          dataLength={filteredItems.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <UserCollectionGrid
            items={filteredItems}
            onDelete={handleDeleteItem} //pass isGuest to disable delete and edit for guest
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
      </div>
    </div>
  );
};

export default UserHomePage;

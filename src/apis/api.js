import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/ma-tracking";

export const getItemByRating = async (rating) => {
  return new Array(10).fill(null).map((_, index) => ({
    id: `item-${rating}-${index}`,
    title: `item Title ${rating}-${index}`,
    genre: "Drama",
    imageUrl: `https://via.placeholder.com/300?text=Series+${rating}-${index}`,
  }));
};

// export const getCollectionsDetailWithPagination = async (page, limit) => {
//   return new Array(limit).fill(null).map((_, index) => ({
//     id: `item-page-${page}-${index}`,
//     title: `Item Title Page ${page}-${index}`,
//     genre: "Comedy",
//     imageUrl: `https://via.placeholder.com/300?text=Series+Page+${page}-${index}`,
//   }));
// };

export const getCollectionsDetailWithPagination = async (page, limit) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No token found in localStorage");
    return [];
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/user-items`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // return response.data.items;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const searchSeriesByTitle = async (query) => {
  return new Array(5).fill(null).map((_, index) => ({
    id: `item-search-${query}-${index}`,
    title: `${query} Result ${index}`,
    genre: "Action",
    imageUrl: `https://via.placeholder.com/300?text=${query}+Result+${index}`,
  }));
};

export const registerUser = async (userInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userInfo, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error.response?.data || "Registration failed";
  }
};

export const loginUser = async (userInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, userInfo, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data; // This contains the token
  } catch (error) {
    console.error("Error logging in:", error);
    throw error.response?.data || "Login failed";
  }
};

export const getUserDetails = async () => {
  try {
    const token = localStorage.getItem("authToken");
    console.log("Token retrieved from localStorage:", token); // Debugging

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_BASE_URL}/user-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error.response?.data || "Failed to fetch user details";
  }
};

export const uploadAvatar = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${API_BASE_URL}/update-avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error.response?.data || "Failed to upload avatar";
  }
};

export const saveUserItem = async (itemDetails, imageFile) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("title", itemDetails.title);
    formData.append("genre", itemDetails.genre);
    formData.append("content", itemDetails.content);
    formData.append("longContent", itemDetails.longContent);
    formData.append("imageFile", imageFile);

    // console.log("item Details from api: ", itemDetails);
    // Make POST request to save the user item
    const response = await axios.post(`${API_BASE_URL}/save`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving user item:", error);
    throw error.response?.data || "Failed to save user item";
  }
};

export const deleteUserItem = async (itemId) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.delete(`${API_BASE_URL}/delete/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user item:", error);
    throw error.response?.data || "Failed to delete user items";
  }
};

export const updateUserItem = async (itemId, itemDetails, imageFile) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // prepare from data
    const formData = new FormData();
    if (itemDetails.title) formData.append("title", itemDetails.title);
    if (itemDetails.genre) formData.append("genre", itemDetails.genre);
    if (itemDetails.content) formData.append("content", itemDetails.content);
    if (itemDetails.longContent)
      formData.append("longContent", itemDetails.longContent);
    if (imageFile) formData.append("imageFile", imageFile);

    //make PUT request to update the user item
    const response = await axios.put(
      `${API_BASE_URL}/update/${itemId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user item:", error);
    throw error.response?.data || "Failed to update user item";
  }
};

export const getGuestItemsWithPagination = async (page, limit) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/guest-items`, {
      params: { page, limit },
    });
    console.log("API response data:", response.data.items);
    return response.data;
    // return response.data.items;
  } catch (error) {
    console.log("Error fetching guest items: ", error);
    return { items: [], totalItems: 0 };
  }
};

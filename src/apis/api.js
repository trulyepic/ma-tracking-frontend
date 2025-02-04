import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api/ma-tracking";
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// const API_BASE_URL_AUTH = "http://localhost:8080/api/auth";
const API_BASE_URL_AUTH = process.env.REACT_APP_AUTH_URL;

export const getItemByRating = async (rating) => {
  return new Array(10).fill(null).map((_, index) => ({
    id: `item-${rating}-${index}`,
    title: `item Title ${rating}-${index}`,
    genre: "Drama",
    imageUrl: `https://via.placeholder.com/300?text=Series+${rating}-${index}`,
  }));
};

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
    // console.log("Token retrieved from localStorage:", token); // Debugging

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_BASE_URL}/user-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response from api: userdetails: ", response.data);
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
    if (itemDetails.collectionId)
      formData.append("collectionId", itemDetails.collectionId);
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

export const togglePublicView = async (publicView, collectionLink) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.put(`${API_BASE_URL}/toggle-public-view`, null, {
    params: { publicView, collectionLink },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPublicGuestCollections = async () => {
  const response = await axios.get(`${API_BASE_URL}/public-guest-collections`);
  return response.data;
};

// export const getPublicCollections = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/public-collections`);
//     return response.data; // Returns an array of UserInfoDTO
//   } catch (error) {
//     console.error("Error fetching public collections:", error);
//     throw error.response?.data || "Failed to fetch public collections";
//   }
// };

export const getPublicCollections = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/public-collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Returns an array of UserInfoDTO
  } catch (error) {
    console.error("Error fetching public collections:", error);
    throw error.response?.data || "Failed to fetch public collections";
  }
};

export const getUserDetailsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details by ID:", error);
    throw error.response?.data || "Failed to fetch user details";
  }
};

export const getCollectionsDetailWithPaginationId = async (
  page,
  limit,
  userId
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/${userId}/collections`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { items: [], totalItems: 0 };
  }
};

export const likeCollection = async (collectionOwnerId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  await axios.post(`${API_BASE_URL}/${collectionOwnerId}/like`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const unlikeCollection = async (collectionOwnerId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  await axios.delete(`${API_BASE_URL}/${collectionOwnerId}/unlike`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

let publicToken = null;
export const getPublicToken = async () => {
  if (publicToken) return publicToken; // Use cached token if available
  try {
    const response = await axios.get(`${API_BASE_URL}/public-token`);
    publicToken = `Bearer ${response.data}`; // Cache the token
    // console.log("public response token: ", response);
    console.log("public response publicToken: ", publicToken);
    return publicToken;
  } catch (error) {
    console.error("Error fetching public token:", error);
    throw new Error("Failed to fetch public token");
  }
};

export const updateUserInfo = async (userInfo) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `${API_BASE_URL}/update-user-info`,
      userInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const searchPublicCollections = async (query) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/search-public-collections`,
      {
        params: { query },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error searching public collections:", error);
    throw error.response?.data || "Failed to search public collections";
  }
};

export const searchUserCollections = async (userId, query) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_BASE_URL}/search-collections`, {
      params: { userId, query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching collections:", error);
    return [];
  }
};

/**
 * Check if the given username is available.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} - Returns true if the username is available, otherwise false.
 */
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-username`, {
      params: { username },
    });
    return response.data.available;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error.response?.data || "Failed to check username availability";
  }
};

/**
 * Confirm a user's email address.
 * Sends a POST request to confirm the email using the provided token.
 * @param {string} token - The email confirmation token.
 * @returns {Promise<Object>} The API response or error response.
 */
export const confirmEmail = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/confirm-email`, null, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Error confirming email:", error);
    throw error.response?.data || "Failed to confirm email";
  }
};

export const resendEmailConfirmation = async (email, provider = "gmail") => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/resend-confirmation`,
      null,
      {
        params: { email, provider }, // Send provider as a parameter
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error resending confirmation email:", error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw "Failed to resend confirmation email";
  }
};

export const googleSignIn = async (idToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}/google`,
      { idToken }, // Send as an object
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Google Sign-In failed:", error);
    throw error.response?.data || "Google Sign-In failed";
  }
};

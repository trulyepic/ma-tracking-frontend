import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/ma-tracking";

// Follow a user
export const followUser = async (userId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    await axios.post(`${API_BASE_URL}/follow/${userId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return "Followed successfully.";
  } catch (error) {
    console.error("Error following user:", error);
    throw error.response?.data || "Failed to follow user";
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    await axios.delete(`${API_BASE_URL}/unfollow/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return "Unfollowed successfully.";
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error.response?.data || "Failed to unfollow user";
  }
};

// Get followers count
export const getFollowersCount = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/followers/${userId}`);
    return response.data.followers;
  } catch (error) {
    console.error("Error fetching followers count:", error);
    throw error.response?.data || "Failed to fetch followers count";
  }
};

// Get following count
export const getFollowingCount = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/following/${userId}`);
    return response.data.following;
  } catch (error) {
    console.error("Error fetching following count:", error);
    throw error.response?.data || "Failed to fetch following count";
  }
};

// Get follow status
export const getFollowStatus = async (userId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${API_BASE_URL}/follow-status/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.isFollowing;
};

export const getCurrentUserFollowingCount = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/following-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.followingCount;
  } catch (error) {
    console.error("Error fetching following count:", error);
    throw error.response?.data || "Failed to fetch following count";
  }
};

export const getFollowersList = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/followers-list`
    );
    return response.data.followers;
  } catch (error) {
    console.error("Error fetching followers list:", error);
    throw error;
  }
};

export const getFollowingList = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/following-list`
    );
    return response.data.following;
  } catch (error) {
    console.error("Error fetching following list:", error);
    throw error;
  }
};

export const fetchPaginatedFollowers = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/paginated-followers?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated followers:", error);
    throw error;
  }
};

export const fetchPaginatedFollowing = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/paginated-following?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated following:", error);
    throw error;
  }
};

export const getUserDetailsById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error.response?.data || "Failed to fetch user details";
  }
};

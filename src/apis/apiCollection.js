import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api/collections";

const API_BASE_URL = process.env.REACT_APP_COLECTION_URL;

// const API_BASE_URL_ORI = "http://localhost:8080/api/ma-tracking";
const API_BASE_URL_ORI = process.env.REACT_APP_BASE_URL;

export const createCollection = async (collectionName) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.post(`${API_BASE_URL}/create`, null, {
    params: { collectionName },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCollections = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addItemToCollection = async (
  collectionId,
  itemDetails,
  imageFile
) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  const formData = new FormData();
  formData.append("title", itemDetails.title);
  formData.append("genre", itemDetails.genre);
  formData.append("content", itemDetails.content);
  formData.append("longContent", itemDetails.longContent);
  formData.append("imageFile", imageFile);

  const response = await axios.post(
    `${API_BASE_URL}/${collectionId}/add-item`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getCollectionItems = async (collectionId, page, limit) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${API_BASE_URL}/${collectionId}`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const getGuestCollectionsWithPaginationMa = async (page, limit) => {
  try {
    console.log("REACT_APP_BASE_URL", API_BASE_URL_ORI);
    const response = await axios.get(`${API_BASE_URL_ORI}/guest-items`, {
      params: { page, limit },
    });
    console.log("API response data:", response.data.collections);
    return response.data.collections; // Adjusted to return collections
  } catch (error) {
    console.error("Error fetching guest collections: ", error);
    return []; // Return an empty array on error
  }
};

export const deleteCollection = async (collectionId) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  await axios.delete(`${API_BASE_URL}/delete/${collectionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteItemFromCollection = async (collectionId, itemId) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  await axios.delete(`${API_BASE_URL}/delete/${collectionId}/items/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCollectionsByUserId = async (userId, page, limit) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      params: { page, limit },
    });
    return response.data; // Response includes collections and their items
  } catch (error) {
    console.error("Error fetching collections by user ID:", error);
    throw error;
  }
};

export const updateCollectionName = async (collectionId, newCollectionName) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.patch(
    `${API_BASE_URL}/${collectionId}/update-name`,
    null,
    {
      params: { newCollectionName },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

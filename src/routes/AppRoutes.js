import React from "react";
import { Route, Routes } from "react-router-dom";
// import UserHomePage from "../components/UserHomePage1";
import SignIn from "../components/sign-in-register/SignIn";
import Register from "../components/sign-in-register/Register";
import AddItem from "../components/add-item/AddItem";
import EditItem from "../components/add-item/EditItem";
import CardDetailPage from "../components/card-detail/CardDetailPage";
import ListCollectionsPage from "../components/public-list-collections/ListCollectionsPage";
import UserHomePage from "../components/UserHomePage";
import CollectionHomePage from "../components/CollectionHomePage";
import AddCollection from "../components/add-item/AddCollection";
import Settings from "../components/settings/Settings";
import ProfilePage from "../components/user-profile/ProfilePage";
import ForgotPassword from "../components/sign-in-register/ForgotPassword";
import ConfirmEmailPage from "../components/sign-in-register/ConfirmEmailPage";
import CookieNotice from "../components/cookies/CookieNotice";
import CommentPolicy from "../components/comment/CommentPolicy";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CollectionHomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/additem" element={<AddItem />} />
      <Route path="/edititem/:id" element={<EditItem />} />
      <Route path="/card/:id" element={<CardDetailPage />} />
      <Route path="/list-collections" element={<ListCollectionsPage />} />

      {/* Dynamic route for user homepage */}
      <Route path="/user-homepage/:id" element={<UserHomePage />} />
      <Route path="/collection-homepage/:id" element={<CollectionHomePage />} />
      <Route path="/addCollection" element={<AddCollection />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/user-profile/:id" element={<ProfilePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      <Route path="/cookie-policy" element={<CookieNotice />} />
      <Route path="/comment-policy" element={<CommentPolicy />} />
    </Routes>
  );
};

export default AppRoutes;

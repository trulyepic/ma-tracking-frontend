import React from "react";
import { Route, Routes } from "react-router-dom";
import UserHomePage from "../components/UserHomePage";
import SignIn from "../components/sign-in-register/SignIn";
import Register from "../components/sign-in-register/Register";
import AddItem from "../components/add-item/AddItem";
import EditItem from "../components/add-item/EditItem";
import CardDetailPage from "../components/card-detail/CardDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserHomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/additem" element={<AddItem />} />
      <Route path="/edititem/:id" element={<EditItem />} />
      <Route path="/card/:id" element={<CardDetailPage />} />
    </Routes>
  );
};

export default AppRoutes;

import React from "react"

import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";

export default function PageRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<MainPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}
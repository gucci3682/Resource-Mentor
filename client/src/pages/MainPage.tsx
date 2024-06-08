import React, { useState } from "react";

import SideNav from "../components/global/Sidebar";
import Topbar from "../components/global/Topbar";

import { Route, Routes } from "react-router-dom";
import Dashboard from "./ActivityDashboard";
import Projects from "./Projects";
import Profile from "./Profile";
import History from "./History";
import Timesheet from "./Timesheet";

export default function MainPage() {
    const [isSidebar, setIsSidebar] = useState<boolean>(true);

    return (
        <div className="app">
            <SideNav isSidebar={isSidebar} />
            <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/timesheet" element={<Timesheet />} />
                </Routes>
            </main>
        </div>
    );
}
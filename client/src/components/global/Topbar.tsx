import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../user/UserContext";
import { ColorModeContext, tokens } from "../../theme";

import { Box, IconButton, useTheme, Popover, Button, Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../../assets/images/NTT-DATA-logo.png";

interface TopbarProps {
    setIsSidebar: Function
}

export default function Topbar(props: TopbarProps) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* IMAGE */}
            <Link to="/dashboard">
                <Box
                    component="img"
                    sx={{
                        height: 40,
                        width: 130,
                        aspectRatio: 3.7,
                        paddingBottom: 0.7
                    }}
                    src={logo}
                />
            </Link>

            {/* SEARCH BAR */}
            <Box
                display="flex"
                bgcolor={colors.primary[400]}
                borderRadius="3px"
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton onClick={handleOpen}>
                    <PersonOutlinedIcon />
                </IconButton>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography sx={{ p: 2 }}>{user?.resource_name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                        <Button onClick={handleLogout} startIcon={<LogoutIcon />}>Sign Out</Button>
                    </Box>
                </Popover>
            </Box>
        </Box>
    );
};
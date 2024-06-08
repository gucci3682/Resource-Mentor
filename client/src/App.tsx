import React from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import PageRoutes from "./Routes";
import { UserProvider } from "./components/user/UserContext";

export default function App() {
    const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <UserProvider>
                    <PageRoutes />
                </UserProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

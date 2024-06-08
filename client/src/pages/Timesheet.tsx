import React from "react";
import { Box } from "@mui/material";
import { Header } from "../components/dashboard/others/Header";
import { TimesheetCalendar } from "../components/timesheet/TimesheetCalendar";


export default function Timesheet() {

    return (
        <Box m="20px">
            <Header title="Timesheet" subtitle="Submit your timesheet here" />
            <TimesheetCalendar />
        </Box>

    );
}

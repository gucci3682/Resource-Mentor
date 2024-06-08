import React from "react";
import { IEventInfo } from "./TimesheetCalendar"
import { Typography } from "@mui/material";

interface IProps {
    event: IEventInfo
}

export function TimesheetInfo({ event }: IProps) {
    return (
        <>
            {Object.entries(event).map(([key, value]) => {
                // Exclude _id from being rendered
                if (key === '_id' || key === 'start' || key === 'end') {
                    return null;
                }

                // Check if description is defined before rendering it
                let displayValue = value;
                if (key === 'description') {
                    displayValue = value ? value : 'No description provided';
                }

                // Format date values
                if (value instanceof Date) {
                    displayValue = value.toLocaleString();
                }

                return (
                    <Typography key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${displayValue}`}</Typography>
                );
            })}
        </>
    );
}

export function TimesheetName({ event }: IProps) {
    return (
        <Typography>{`Project Name: ${event.project_name}`}</Typography>
    );
}
import React from "react";
import { SetStateAction, MouseEvent, Dispatch } from "react"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box, Typography } from "@mui/material"
import { IEventInfo } from "./TimesheetCalendar"
import { TimesheetInfo } from "./TimesheetInfo";

interface IProps {
    open: boolean
    handleClose: Dispatch<SetStateAction<void>>
    onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
    currentEvent: IEventInfo
}

export function TimesheetInfoModal({ open, handleClose, onDeleteEvent, currentEvent }: IProps) {
    const onClose = () => {
        handleClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Timesheet Info</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TimesheetInfo event={currentEvent} />
                </DialogContentText>
                <Box component="form"></Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="info" onClick={onDeleteEvent}>
                    Delete Timesheet
                </Button>
            </DialogActions>
        </Dialog>
    )
}

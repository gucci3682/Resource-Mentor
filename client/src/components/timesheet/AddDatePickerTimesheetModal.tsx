import React, { Dispatch, MouseEvent, SetStateAction, ChangeEvent } from "react"
import {
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Autocomplete,
    Box,
    Checkbox,
    Typography,
} from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePickerEventTimesheetData } from "./TimesheetCalendar"
import { TimesheetForm } from "./TimesheetForm"

interface IProps {
    open: boolean
    handleClose: Dispatch<SetStateAction<void>>
    datePickerEventFormData: DatePickerEventTimesheetData
    setDatePickerEventFormData: Dispatch<SetStateAction<DatePickerEventTimesheetData>>
    onAddTimesheet: (e: MouseEvent<HTMLButtonElement>) => void
    timeLogged: number
}

export function AddDatePickerTimesheetModal({
    open,
    handleClose,
    datePickerEventFormData,
    setDatePickerEventFormData,
    onAddTimesheet,
    timeLogged,
}: IProps) {
    // const { description, start, end, allDay } = datePickerEventFormData

    const onClose = () => {
        handleClose()
    }

    const isDisabled = () => {
        // const checkend = () => {
        //     if (!allDay && end === null) {
        //         return true
        //     }
        // }
        // if (description === "" || start === null || checkend()) {
        //     return true
        // }
        return false
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Timesheet</DialogTitle>
            <DialogContent>
                <DialogContentText>To add a timesheet, please fill in the information below.</DialogContentText>
                <Box component="form">
                    <TimesheetForm
                        datePickerEventFormData={datePickerEventFormData}
                        setDatePickerEventFormData={setDatePickerEventFormData}
                        totalLogged={timeLogged}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={isDisabled()} color="success" onClick={onAddTimesheet}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}

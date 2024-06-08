import React, { useState, MouseEvent } from "react";
import axios from "axios";
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Divider } from "@mui/material"
import { Calendar, type Event, dateFnsLocalizer } from "react-big-calendar"

import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"

import "react-big-calendar/lib/css/react-big-calendar.css"
import { TimesheetInfo, TimesheetName } from "./TimesheetInfo";
import { TimesheetInfoModal } from "./TimesheetInfoModal";
import { AddDatePickerTimesheetModal } from "./AddDatePickerTimesheetModal";
import dayjs, { Dayjs } from "dayjs";

const locales = {
    "en-US": enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

export interface IEventInfo extends Event {
    _id: string;
    project_so: string;
    project_name: string;
    project_id: string;
    resource_name: string;
    resource_id: string;
    task_name: string;
    task_id: string;
    start_time: Date;
    end_time: Date;
    billable: number;
    non_billable: number;
    reason: string;
    description?: string;
    submitted_on: Date;
    status: string;
    remaining_time: number;
}

export interface DatePickerEventTimesheetData {
    project_so: string;
    project_name: string;
    project_id: string;
    resource_name: string;
    resource_id: string;
    task_name: string;
    task_id: string;
    start_time: Date;
    end_time: Date;
    billable: number;
    non_billable: number;
    reason: string;
    description?: string;
    submitted_on: Date;
    status: string;
    remaining_time: number;
}

const initialDatePickerEventTimesheetData: DatePickerEventTimesheetData = {
    project_so: "",
    project_name: "",
    project_id: "",
    resource_name: "",
    resource_id: "",
    task_name: "",
    task_id: "",
    start_time: new Date(),
    end_time: new Date(),
    billable: 0,
    non_billable: 0,
    reason: "",
    description: "",
    submitted_on: new Date(),
    status: "",
    remaining_time: 0,
}

export function TimesheetCalendar() {
    const [openSlot, setOpenSlot] = useState<boolean>(false);
    const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null);
    const [timesheetInfoModal, setTimesheetInfoModal] = useState<boolean>(false);
    const [openDatePickerModal, setOpenDatePickerModal] = useState<boolean>(false);
    const [datePickerEventTimesheetData, setDatePickerEventTimesheetData] = useState<DatePickerEventTimesheetData>(initialDatePickerEventTimesheetData);
    const [eventInfoModal, setEventInfoModal] = useState<boolean>(false);
    const [events, setEvents] = useState<IEventInfo[]>([]);
    const [startTime, setStartTime] = useState<Dayjs>(dayjs(""));
    const [endTime, setEndTime] = useState<Dayjs>(dayjs(""));
    const [totalTimeLogged, setTotalTimeLogged] = useState<Record<string, number>>({});
    const [timelogged, setTimeLogged] = useState<number>(0);

    // const handleSelectSlot = (event: Event) => {
    //     setOpenSlot(true);
    //     setCurrentEvent(event);
    // }

    const handleSelectSlot = (slotInfo: any) => {
        // Open the form and set the start and end times to the selected slot
        setOpenDatePickerModal(true);
        setDatePickerEventTimesheetData({
            ...initialDatePickerEventTimesheetData,
            start_time: slotInfo.start,
            end_time: slotInfo.end,
        });
        setStartTime(dayjs(slotInfo.start));
        setEndTime(dayjs(slotInfo.end));
    }


    const handleSelectEvent = (event: IEventInfo) => {
        setCurrentEvent(event);
        setEventInfoModal(true);
    }

    const handleClose = () => {
        setDatePickerEventTimesheetData(initialDatePickerEventTimesheetData)
        setOpenSlot(false);
    }

    const handleDatePickerClose = () => {
        setDatePickerEventTimesheetData(initialDatePickerEventTimesheetData)
        setOpenDatePickerModal(false)
    }

    const sendTimesheet = async (url: string, timesheets: IEventInfo[] | IEventInfo) => {
        try {
            const response = await axios.post(url, JSON.stringify(timesheets), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(`HTTP error! status: ${error.response?.status}`);
            } else {
                console.error(`An error occurred: ${error}`);
            }
            alert("Error in submitting timesheet!")
            throw error;
        }
    };

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // Send all the timesheets in your state to your server
        try {
            const url = events.length > 1 ? '/timesheet/create-multiple' : '/timesheet/create';
            const timesheet = events.length > 1 ? events : events[0];
            await sendTimesheet(url, timesheet);
            alert('Timesheets successfully submitted!');
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    }


    const onAddTimesheetFromDatePicker = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const _id = Math.random().toString(36).substr(2, 9);

        // Calculate the duration of the new timesheet in hours
        const duration = dayjs(datePickerEventTimesheetData.end_time).diff(dayjs(datePickerEventTimesheetData.start_time), 'hour');

        // Update the total time logged for the project and task
        const projectTaskKey = `${datePickerEventTimesheetData.project_id}-${datePickerEventTimesheetData.task_id}`;
        const newTotalTimeLogged = (totalTimeLogged[projectTaskKey] || 0) + duration;
        setTotalTimeLogged({
            ...totalTimeLogged,
            [projectTaskKey]: newTotalTimeLogged,
        });
        setTimeLogged(newTotalTimeLogged);

        // Calculate the remaining time for the project or task
        const remaining_time = datePickerEventTimesheetData.remaining_time - newTotalTimeLogged;

        // Update the remaining_time in the datePickerEventTimesheetData state
        setDatePickerEventTimesheetData(prevState => ({
            ...prevState,
            remaining_time,  // Update the remaining time
        }));

        const newTimesheet: IEventInfo = {
            ...datePickerEventTimesheetData,
            _id,
            start: datePickerEventTimesheetData.start_time,
            end: datePickerEventTimesheetData.end_time,
            remaining_time,  // Add the remaining time to the new timesheet
        };

        const newEvents = [...events, newTimesheet]

        setEvents(newEvents)
        setDatePickerEventTimesheetData(initialDatePickerEventTimesheetData)
        setOpenDatePickerModal(false)
    }


    const onDeleteEvent = () => {
        setEvents(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
        setEventInfoModal(false)
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
        >
            <Container maxWidth={false}>
                <Box display="flex" justifyContent="space-between">
                    <Button onClick={() => setOpenDatePickerModal(true)} size="small" color="secondary" variant="contained">
                        Add timesheet
                    </Button>
                    <Button onClick={handleSubmit} type="submit" color="secondary" variant="contained">
                        Submit
                    </Button>
                </Box>
                <br></br>
                <AddDatePickerTimesheetModal
                    open={openDatePickerModal}
                    handleClose={handleDatePickerClose}
                    datePickerEventFormData={datePickerEventTimesheetData}
                    setDatePickerEventFormData={setDatePickerEventTimesheetData}
                    onAddTimesheet={onAddTimesheetFromDatePicker}
                    timeLogged={timelogged}
                />
                <TimesheetInfoModal
                    open={eventInfoModal}
                    handleClose={() => setEventInfoModal(false)}
                    onDeleteEvent={onDeleteEvent}
                    currentEvent={currentEvent as IEventInfo}
                />
                <Calendar
                    localizer={localizer}
                    events={events}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    startAccessor="start"
                    components={{ event: TimesheetName }}
                    endAccessor="end"
                    defaultView="week"
                    views={['month', 'week']}
                    style={{
                        height: 900,
                    }}
                />
            </Container>
        </Box>
    );
}
import React, { useState, useRef, useEffect, SetStateAction, Dispatch, ChangeEvent } from "react";
import axios from "axios";
import { TextField, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Autocomplete from '@mui/material/Autocomplete';
import { DatePickerButton } from "../core/buttons/DatePickers"
import dayjs, { Dayjs } from "dayjs";
import SignatureCanvas from "react-signature-canvas"

import "../../assets/css/sigCanvas.css"
import { DatePickerEventTimesheetData } from "./TimesheetCalendar";
import { useUser } from "../user/UserContext";

interface ITimesheetData {
    datePickerEventFormData: DatePickerEventTimesheetData
    setDatePickerEventFormData: Dispatch<SetStateAction<DatePickerEventTimesheetData>>
    totalLogged: number
}

interface Project {
    project_id: string;
    project_name: string;
    project_so: string;
}

interface Task {
    task_id: string;
    task_name: string;
}


export function TimesheetForm({
    datePickerEventFormData,
    setDatePickerEventFormData,
    totalLogged
}: ITimesheetData) {
    const [startTime, setStartTime] = useState<Dayjs>(dayjs(""));
    const [endTime, setEndTime] = useState<Dayjs>(dayjs(""));
    const [msg, setMsg] = useState<string>("");
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [totalNonBillableHours, setTotalNonBillableHours] = useState<number>(0);
    const [reasonForNonBillable, setReasonForNonBillable] = useState<string>("");
    const [totalBillable, setTotalBillable] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [projectData, setProjectData] = useState<Record<string, Project>>({});
    const [taskData, setTaskData] = useState<Record<string, Task>>({});
    const [currentProject, setCurrentProject] = useState<string>("");
    const [currentTask, setCurrentTask] = useState<string>("");

    const [allocatedHours, setAllocatedHours] = useState<number>(0);
    const [approvedHours, setApprovedHours] = useState<number>(0);
    const [pendingHours, setPendingHours] = useState<number>(0);
    const [remainingHours, setRemainingHours] = useState<number>(0);
    const [initialRemainingHours, setInitialRemainingHours] = useState<number>(0);

    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const { user } = useUser();

    // const clear = () => {
    //     if (sigCanvas.current) {
    //         sigCanvas.current.clear();
    //     }
    // }

    // const save = () => {
    //     if (sigCanvas.current) {
    //         console.log(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    //         setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"))
    //     }
    // };

    // const close = () => {
    //     if (sigCanvas.current) {
    //         sigCanvas.current.clear();
    //     }
    //     setIsOpen(false);
    // }

    const handleFormSubmit = (values: any) => {
        console.log(values);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'billable' || name === 'non_billable') {
            const remaining_time = datePickerEventFormData.remaining_time - parseFloat(value);
            setDatePickerEventFormData({
                ...datePickerEventFormData,
                [name]: value,
                remaining_time,
            });
        } else {
            setDatePickerEventFormData({
                ...datePickerEventFormData,
                [name]: value,
            });
        }
    }

    // projects
    useEffect(() => {
        const userData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
            month: dayjs(datePickerEventFormData.start_time).month() + 1,
        }

        axios
            .post("projects/getProjects", userData)
            .then((response) => {
                const data: Project[] = response.data;
                const transformedData = data.reduce((acc: Record<string, Project>, project: Project) => {
                    acc[project.project_so] = {
                        project_id: project.project_id,
                        project_name: project.project_name,
                        project_so: project.project_so,
                    };
                    return acc;
                }, {});
                setProjectData(transformedData);
            })
            .catch((error) => {
                console.error("Error taking data for project table", error);
            })
    }, [])

    useEffect(() => {
        const currentProjectData = {
            resource_id: user ? user.resource_id : "",
            project_id: currentProject,
            month: dayjs(datePickerEventFormData.start_time).month() + 1,
        }

        axios
            .post("projects/getTasks", currentProjectData)
            .then((response) => {
                const resData = response.data;
                const data: Task[] = response.data;
                const transformedData = data.reduce((acc: Record<string, Task>, task: Task) => {
                    acc[task.task_name] = {
                        task_id: task.task_id,
                        task_name: task.task_name,
                    };
                    return acc;
                }, {});
                setTaskData(transformedData);
            })
            .catch((error) => {
                console.error("Error taking data for project table", error);
            })
    }, [currentProject])

    useEffect(() => {
        const currentTaskData = {
            resource_id: user ? user.resource_id : "",
            project_id: currentProject,
            task_id: currentTask,
            month: dayjs(datePickerEventFormData.start_time).month() + 1,
        }

        axios
            .post("timesheet/getHours", currentTaskData)
            .then((response) => {
                setAllocatedHours(response.data.allocated_hours ? response.data.allocated_hours : 0);
                setApprovedHours(response.data.approved ? response.data.approved : 0);
                setPendingHours(response.data.pending ? response.data.pending : 0);

                const remainingHours = response.data.allocated_hours - (response.data.approved ? response.data.approved : 0) - totalLogged;
                setRemainingHours(remainingHours);
                setInitialRemainingHours(remainingHours);

                // Update the remaining_time field of your DatePickerEventTimesheetData state
                setDatePickerEventFormData(prevState => ({
                    ...prevState,
                    remaining_time: remainingHours,
                }));
            })
            .catch((error) => {
                console.error("Error taking data for project table", error);
            })
    }, [currentTask])


    useEffect(() => {
        setDatePickerEventFormData({
            ...datePickerEventFormData,
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
        });
    }, [])

    useEffect(() => {
        if (dayjs(startTime).isValid() && dayjs(endTime).isValid()) {
            const clockedMinutes = dayjs(endTime).diff(dayjs(startTime), 'minute');
            const clockedHours = clockedMinutes / 60;
            setTotalBillable(clockedHours);
        }
    }, [startTime, endTime]);

    useEffect(() => {
        if (startTime.isValid() && endTime.isValid() && !isNaN(totalNonBillableHours)) {
            const clockedHours = endTime.diff(startTime, 'hour');
            const billableHours = clockedHours - totalNonBillableHours;
            setTotalBillable(billableHours);
            setDatePickerEventFormData({
                ...datePickerEventFormData,
                billable: billableHours
            });
        }
    }, [totalNonBillableHours]);

    useEffect(() => {
        if (totalBillable >= 0) {
            // Calculate the new remaining hours based on the initial allocated hours
            const newRemaining = initialRemainingHours - totalBillable;

            if (newRemaining)
                console.log(newRemaining);
            setRemainingHours(newRemaining);

            // Update the remaining_time field of your DatePickerEventTimesheetData state
            setDatePickerEventFormData(prevState => ({
                ...prevState,
                remaining_time: newRemaining,
            }));
        }

    }, [totalBillable]);


    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Stack direction="row" useFlexGap flexWrap="wrap" spacing={{ xs: 1, sm: 2 }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={Object.keys(projectData)}
                            sx={{ width: 300 }}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setDatePickerEventFormData({
                                        ...datePickerEventFormData,
                                        project_so: newValue,
                                        project_id: projectData[newValue as keyof typeof projectData].project_id,
                                        project_name: projectData[newValue as keyof typeof projectData].project_name,
                                    });
                                    setCurrentProject(projectData[newValue as keyof typeof projectData].project_id);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="SO Ticket" />}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={Object.keys(taskData)}
                            sx={{ width: 300 }}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setDatePickerEventFormData({
                                        ...datePickerEventFormData,
                                        task_name: newValue,
                                        task_id: taskData[newValue as keyof typeof taskData].task_id,
                                    });
                                    setCurrentTask(taskData[newValue as keyof typeof taskData].task_id);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Task" />}
                        />
                        <DatePickerButton
                            label="Start Date & Time"
                            value={dayjs(datePickerEventFormData.start_time)}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setDatePickerEventFormData({
                                        ...datePickerEventFormData,
                                        start_time: newValue.toDate(),
                                    });
                                    setStartTime(newValue);
                                }
                            }}
                        />
                        <DatePickerButton
                            label="End Time"
                            value={dayjs(datePickerEventFormData.end_time)}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setDatePickerEventFormData({
                                        ...datePickerEventFormData,
                                        end_time: newValue.toDate(),
                                    });
                                    setEndTime(newValue);
                                }
                            }}
                        />
                        <Typography>Total Allocated Hours for current task this month: {allocatedHours}</Typography>
                        <Typography>Total Approved Hours for current task this month: {approvedHours}</Typography>
                        <Typography>Total Pending Hours for current task this month: {pendingHours}</Typography>
                        <Typography>Remaining Hours for current task this month: {remainingHours}</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="number"
                            label="Total non billable hours"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                setTotalNonBillableHours(parseFloat(e.target.value))
                                setDatePickerEventFormData({
                                    ...datePickerEventFormData,
                                    non_billable: parseFloat(e.target.value)
                                });
                            }}
                            value={totalNonBillableHours}
                            name="non_billable"
                            error={!!touched.non_billable && !!errors.non_billable}
                            helperText={touched.non_billable && errors.non_billable}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={["Administration", "Meeting"]}
                            sx={{ width: 300 }}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setReasonForNonBillable(newValue);
                                    setDatePickerEventFormData({
                                        ...datePickerEventFormData,
                                        reason: newValue
                                    });
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Reason for non-billable" />}
                        />
                        <Typography variant="body1">
                            Total Billable Hours: {totalBillable.toFixed(1)}
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="text"
                            label="Description"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                setDatePickerEventFormData({
                                    ...datePickerEventFormData,
                                    description: e.target.value
                                });
                            }}
                            value={description}
                            name="description"
                            error={!!touched.description && !!errors.description}
                            helperText={touched.description && errors.description}
                            sx={{ gridColumn: "span 2" }}
                        />
                        {/* <Popup
                                modal
                                trigger={<Button variant="contained">Add Signature</Button>}
                                closeOnDocumentClick={false}
                                open={isOpen}
                                onClose={close}
                            >
                                <SignatureCanvas ref={sigCanvas} canvasProps={{
                                    className: "signatureCanvas"
                                }} />
                                <Button variant="contained" color="primary" onClick={close}>Close</Button>
                                <Button variant="contained" color="primary" onClick={clear}>Clear</Button>
                                <Button variant="contained" color="primary" onClick={save}>Save</Button>
                            </Popup> */}
                    </Stack>
                    <br />
                    {
                        imageURL ? (
                            <img
                                src={imageURL}
                                alt="client_signature"
                                style={{
                                    display: "block",
                                    margin: "0 auto",
                                    border: "1px solid black",
                                    width: "150px"
                                }}
                            />
                        ) : null
                    }

                </form>
            )}
        </Formik>

    );
}

const checkoutSchema = yup.object().shape({
    so_ticket: yup.string().required("required"),
    start_time: yup.string().required("required"),
    end_time: yup.string().required("required"),
    description: yup.string().required("required"),
    non_billable: yup.string().required("required"),
});

const initialValues = {
    so_ticket: "",
    start_time: "",
    end_time: "",
    description: "",
    non_billable: "",
};
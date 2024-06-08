import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "../components/dashboard/charts/PieChart";
import { BarChart } from "../components/dashboard/charts/BarChart";
import { GenericTable } from "../components/dashboard/tables/Table";
import dayjs from 'dayjs';
import Grid from '@mui/material/Unstable_Grid2';
import { useUser } from "../components/user/UserContext";
import { Select, MenuItem, SelectChangeEvent, Card, CardContent, Typography, CardHeader, Box } from '@mui/material';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface Project {
    id: string;
    project_name: string;
    project_so: string;
    status: Status;
    submitted_on: Date;
}

type ProjectData = {
    project_name: string;
    allocated: number;
    approved: number;
};

export type ChartData = {
    name: string;
    data: number[];
};

const months = [
    'January [26 Dec - 25 Jan]',
    'February [26 Jan - 25 Feb]',
    'March [26 Feb - 25 Mar]',
    'April [26 Mar - 25 Apr]',
    'May [26 Apr - 25 May]',
    'June [26 May - 25 Jun]',
    'July [26 Jun - 25 Jul]',
    'August [26 Jul - 25 Aug]',
    'September [26 Aug - 25 Sep]',
    'October [26 Sep - 25 Oct]',
    'November [26 Oct - 25 Nov]',
    'December [26 Nov - 25 Dec]'];

export default function Dashboard() {
    const { user } = useUser();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [allocatedHours, setAllocatedHours] = useState<number>(0);
    const [approvedHours, setApprovedHours] = useState<number>(0);
    const [pendingHours, setPendingHours] = useState<number>(0);
    const [remainingHours, setRemainingHours] = useState<number>(0);
    const [barChartData, setBarChartData] = useState<ChartData[]>([]);
    const [currentProjectNames, setCurrentProjectNames] = useState<string[]>([]);

    const calculateRemainingHours = (allocated: number, approved: number, pending: number) => {
        if (approved === 0 && pending === 0) {
            setRemainingHours(allocated);
        }
        let remaining = allocated - approved - pending;
        setRemainingHours(remaining);
    }

    const calculateHoursinPercentage = (allocated: number, target: number) => {
        if (allocated === 0) {
            return 0;
        }
        let percentage = Math.ceil((target / allocated) * 100);
        return percentage;
    }

    // pie chart
    useEffect(() => {
        const userData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
            month: selectedMonth,
        };

        axios
            .post("dashboard/piechart", userData)
            .then((response) => {
                const data = response.data;

                setAllocatedHours(data.allocated);
                setApprovedHours(data.approved);
                setPendingHours(data.pending);
            })
            .catch((error) => {
                console.error("Error taking data for project table", error);
            })
    }, [selectedMonth])

    useEffect(() => {
        calculateRemainingHours(allocatedHours, approvedHours, pendingHours);
    }, [allocatedHours, approvedHours, pendingHours])

    // overall hours table 
    useEffect(() => {
        const userData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
            month: selectedMonth
        };

        axios
            .post<ProjectData[]>("projects/getProjects", userData)
            .then((response) => {
                const data = response.data;

                // Prepare the data for the BarChart
                const allocatedData: number[] = [];
                const approvedData: number[] = [];
                const projectNames: string[] = [];

                data.forEach((project: ProjectData) => {
                    allocatedData.push(project.allocated);
                    approvedData.push(project.approved);
                    projectNames.push(project.project_name);
                });

                const chartData: ChartData[] = [
                    { name: 'Allocated', data: allocatedData },
                    { name: 'Approved', data: approvedData }
                ];

                // Set the BarChart data
                setBarChartData(chartData);

                // Set the project names
                setCurrentProjectNames(projectNames);
            })
            .catch((error) => {
                console.error("Error fetching data for BarChart", error);
            });
    }, [selectedMonth]);


    // for pending actions table
    useEffect(() => {
        const userData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
        };
        axios
            .post("history/get", userData)
            .then((response) => {
                const dataWithIds: Project[] = response.data.map((item: any) => (
                    {
                        id: item.timesheet_id,
                        project_name: item.project_name,
                        project_so: item.project_so,
                        status: item.status as Status,
                        submitted_on: dayjs(item.submitted_on).toDate(),
                    }
                ))
                setProjects(dataWithIds);
            })
            .catch((error) => {
                console.error("Error taking data for project table", error);
            })
    }, [])

    const handleMonthChange = (event: SelectChangeEvent<Number>) => {
        setSelectedMonth(event.target.value as number);
    };


    return (
        <Grid container spacing={3}>
            <Grid xs={12}>
                <Select value={selectedMonth} onChange={handleMonthChange}>
                    {months.map((month, index) => (
                        <MenuItem key={month} value={index + 1}>
                            {month}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid lg={4} md={6} xs={12}>
                {allocatedHours > 0 ? (
                    <PieChart
                        chartName="Total Hours"
                        chartSeries={[
                            calculateHoursinPercentage(allocatedHours, remainingHours),
                            calculateHoursinPercentage(allocatedHours, pendingHours),
                            calculateHoursinPercentage(allocatedHours, approvedHours)
                        ]}
                        labels={['Remaining', 'Pending', 'Approved']}
                        sx={{ height: '100%' }}
                    />
                ) : (
                    <Card sx={{ height: "100%" }}>
                        <CardHeader title="Total Hours" />
                        <CardContent>
                            <Typography variant="h5" component="div" align="center">
                                No data available
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Grid>
            <Grid lg={8} xs={12}>
                <BarChart
                    chartName="Overall Hours Used per Project"
                    chartSeries={barChartData}
                    projNames={currentProjectNames}
                    sx={{ height: '100%' }}
                />
            </Grid>
            <Grid lg={12} md={12} xs={12}>
                <GenericTable
                    projects={projects.filter(project => project.status === 'Pending' || project.status === 'Rejected')}
                    sx={{ height: '100%' }}
                />
            </Grid>
        </Grid>
    )
}
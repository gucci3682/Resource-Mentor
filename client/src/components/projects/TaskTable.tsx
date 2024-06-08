import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useUser } from "../user/UserContext";

interface TaskRowData {
    id: string;
    task_name: string;
    allocated: number;
    per_completed: number;
    approved: number;
    pending: number;
}

interface TaskTableProps {
    projectId: number;
    calculatePercentage: (approved: number, allocated: number) => number;
}

export default function TaskTable({ projectId, calculatePercentage }: TaskTableProps) {
    const [rows, setRows] = useState<TaskRowData[]>([]);
    const { user } = useUser();

    useEffect(() => {
        const projectData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
            project_id: projectId,
        };
        axios
            .post("projects/getTasks", projectData)
            .then((response) => {
                const dataWithIds: TaskRowData[] = response.data.map((item: any) => (
                    {
                        id: item.task_id,
                        task_name: item.task_name,
                        allocated: item.allocated,
                        approved: item.approved,
                        pending: item.pending,
                        per_completed: calculatePercentage(item.approved, item.allocated),
                    }
                ))
                setRows(dataWithIds);
            })
            .catch((error) => {
                console.error("Error taking data for task table", error);
            })
    }, [projectId])

    const columns: GridColDef[] = [
        { field: "id", headerName: "Task ID", width: 150 },
        {
            field: "task_name",
            headerName: "Task Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "allocated",
            headerName: "Allocated Hours",
            flex: 1,
        },
        {
            field: "per_completed",
            headerName: "% completed",
            flex: 1,
        },
        {
            field: "approved",
            headerName: "Approved Hours",
            headerAlign: "left",
            align: "left",
            width: 150
        },
        {
            field: "pending",
            headerName: "Pending Hours",
            headerAlign: "left",
            align: "left",
            width: 150
        }
    ];

    return (
        <DataGrid rows={rows} columns={columns} />
    );
};

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, useTheme, Dialog, DialogTitle, DialogContent, } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { Header } from "../components/dashboard/others/Header";
import { useUser } from "../components/user/UserContext";
import TaskTable from "../components/projects/TaskTable";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface RowData {
    id: number;
    project_so: string;
    project_name: string;
    allocated: number;
    per_completed: number;
    approved: number;
    pending: number;
}

export default function Projects() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState<RowData[]>([]);
    const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const { user } = useUser();

    const calculatePercentage = (approved: number, allocated: number) => {
        let result = Number(((approved / allocated) * 100).toFixed(2));
        if (isNaN(result)) {
            result = 0;
        }
        return result;
    }

    useEffect(() => {
        const userData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
        };
        axios
            .post("projects/getProjects", userData)
            .then((response) => {
                const dataWithIds: RowData[] = response.data.map((item: any) => (
                    {
                        id: item.project_id,
                        project_so: item.project_so,
                        project_name: item.project_name,
                        allocated: item.allocated,
                        approved: item.approved,
                        pending: item.pending,
                        per_completed: calculatePercentage(item.approved, item.allocated),
                    }
                ))
                setRows(dataWithIds);
            })
            .catch((error) => {
                console.error("Error taking data for project table", error);
            })
    }, [])


    const columns: GridColDef[] = [
        { field: "id", headerName: "Project ID", width: 150 },
        {
            field: "project_so",
            headerName: "Project SO#",
            headerAlign: "left",
            align: "left",
            width: 150,
        },
        {
            field: "project_name",
            headerName: "Project Name",
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

    const handleRowClick = (params: GridRowParams) => {
        const clickedRow = rows.find((row) => row.id === params.id);
        setSelectedRow(clickedRow || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box m="20px">
            <Header title="Projects" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.blue[700],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blue[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blue[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.blue[700]} !important`,
                    },
                }}
            >
                <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
                {selectedRow &&
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>
                            Tasks for {selectedRow?.project_name}
                            <IconButton style={{ position: 'absolute', right: '8px', top: '8px' }} onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent style={{ width: '500px' }}>
                            <TaskTable projectId={selectedRow.id} calculatePercentage={calculatePercentage} />
                        </DialogContent>
                    </Dialog>
                }
            </Box>
        </Box>
    );
};

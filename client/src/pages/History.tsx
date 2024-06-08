import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { tokens } from "../theme"; // Assuming theme defines color tokens
import { Header } from "../components/dashboard/others/Header";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useUser } from "../components/user/UserContext";

// Interface for row data with added `id` property
interface RowData {
    id: string;
    project_so: string;
    project_name: string;
    submitted_on: string;
    status: string;
    start_time: string;
    end_time: string;
}

export default function History() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useUser();
    const [rows, setRows] = useState<RowData[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    useEffect(() => {
        const userData = {
            resource_name: user ? user.resource_name : "",
            resource_id: user ? user.resource_id : "",
        };

        axios
            .post("/history/get", userData)
            .then((response) => {
                const dataWithIds: RowData[] = response.data.map((item: any) => ({
                    id: item.timesheet_id,
                    ...item, // Spread the rest of the properties
                }));
                setRows(dataWithIds);
            })
            .catch((error) => {
                console.error("Error taking data for history table", error);
            });
    }, []);

    const savePdfFromByteArray = (reportName: string, base64String: string) => {
        var binaryString = window.atob(base64String);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        var blob = new Blob([bytes], { type: "application/pdf" });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;

        // Add the link to the document body
        document.body.appendChild(link);

        // Trigger the click
        link.click();

        // Remove the link from the document body
        document.body.removeChild(link);
    };


    const generatePdf = () => {
        // Loop through the selected rows
        selectedRows.forEach((timesheetId) => {
            // Find the corresponding row data
            const rowData = rows.find((row) => row.id === timesheetId);

            if (rowData) {
                // Define the body parameters for your API
                const bodyParameters = {
                    csr_number: rowData.project_so,
                    job_reference_number: "12345678",
                    on_site_time: rowData.start_time,
                    off_site_time: rowData.end_time,
                    engineer_names: [user ? user.resource_name : ""],
                    job_description: "A long sentence or paragraph of the job description details here.",
                    company_name: "Client Company ABC",
                    site_contact_name: "Jon Doe",
                    site_contact_mobile: "12345678",
                    site_contact_email: "jondoe@email.com",
                    address: "address of some client company ABC here",
                    is_the_job_completed: "true",
                    is_the_project_completed: "false",
                    equipment_replacement:
                    {
                        part_number: "11111111ADDD",
                        serial_number: "00099876666LLL"
                    },
                    uploaded_image_source: "no image uploaded",
                    engineer_sign_datetime: rowData.submitted_on,
                    client_sign_datetime: rowData.submitted_on,
                    footnote: "NTT Singapore Pte. Ltd.(UEN No. 199701382M) | NTT Singapore Solutions Pte. Ltd. (UEN No.198304180K) part of NTT Limited \n 8 Kallang Avenue, #15-01 to 09, Aperia Tower 1, Singapore 339509 T: +65 6517 2000 F: +65 6517 2001 Support Hotline: +65 6329 7500 web:hello.global.ntt"
                };

                // Call your API
                axios.post('/pdf/create', bodyParameters)
                    .then((response) => {
                        // Get the base64String from the response
                        const base64String = response.data;

                        // Generate the PDF
                        savePdfFromByteArray("Client Service Report " + rowData.id.toString(), base64String);
                    })
                    .catch((error) => {
                        console.error("Error generating PDF", error);
                    });
            }
        });
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "Timesheet ID", width: 150 },
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
            headerAlign: "left",
            align: "left",
            width: 200,
        },
        {
            field: "submitted_on",
            headerName: "Submitted Date & Time",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            headerAlign: "left",
            align: "left",
            width: 100,
        },
    ];

    return (
        <Box m="20px">
            <Header title="History" subtitle="View all submitted timesheets here" />
            <Button color="secondary" variant="contained" startIcon={<FileDownloadIcon />} onClick={generatePdf}>
                Download PDF
            </Button>
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
                <DataGrid
                    checkboxSelection
                    rows={rows}
                    columns={columns}
                    onRowSelectionModelChange={(newSelection: GridRowId[]) => {
                        setSelectedRows(newSelection as string[]);
                    }}
                />
            </Box>
        </Box>
    );
}

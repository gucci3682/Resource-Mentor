import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs from 'dayjs';

const statusMap = {
  Pending: { label: 'Pending', color: 'warning' },
  Approved: { label: 'Approved', color: 'success' },
  Rejected: { label: 'Rejected', color: 'error' },
} as const;

export interface Project {
  id: string;
  project_name: string;
  project_so: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_on: Date;
}

export interface TableProps {
  projects?: Project[];
  sx?: SxProps;
}

export function GenericTable({ projects = [], sx }: TableProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Pending Actions" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Timesheet ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project SO#</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              const { label, color } = statusMap[project.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell>{project.project_so}</TableCell>
                  <TableCell>{dayjs(project.submitted_on).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowForwardIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}

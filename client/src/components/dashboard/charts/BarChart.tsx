'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';

import Chart from "react-apexcharts";
import { ChartData } from '../../../pages/ActivityDashboard';

export interface BarChartProps {
    chartName: string;
    chartSeries: { name: string; data: number[] }[];
    projNames: string[];
    sx?: SxProps;
}

type ChartOptions = ApexOptions & {
    xaxis: {
        categories: string[];
    };
};

export function BarChart({ chartName, chartSeries, projNames, sx }: BarChartProps): React.JSX.Element {
    const chartOptions = useChartOptions(projNames);

    return (
        <Card sx={sx}>
            <CardHeader
                title={chartName}
            />
            <CardContent>
                <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
            </CardContent>
            <Divider />
        </Card>
    );
}

function useChartOptions(projNames: string[]): ChartOptions {
    const theme = useTheme();

    return {
        chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
        colors: [theme.palette.info.main, alpha(theme.palette.info.main, 0.25)],
        dataLabels: { enabled: false },
        fill: { opacity: 1, type: 'solid' },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        legend: { show: false },
        plotOptions: { bar: { columnWidth: '40px' } },
        stroke: { colors: ['transparent'], show: true, width: 2 },
        theme: { mode: theme.palette.mode },
        xaxis: {
            axisBorder: { color: theme.palette.divider, show: true },
            axisTicks: { color: theme.palette.divider, show: true },
            categories: projNames,
            labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
        },
        yaxis: {
            labels: {
                formatter: (value) => (value > 0 ? `${value} Hours` : `${value}`),
                offsetX: -10,
                style: { colors: theme.palette.text.secondary },
            },
        },
    };
}

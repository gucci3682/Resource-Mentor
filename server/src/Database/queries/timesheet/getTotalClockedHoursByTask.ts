export const getTotalClockedHoursByTask =
`
SELECT sum(billable) as total_clocked FROM public.timesheet
WHERE resource_id = $1
AND project_id = $2
AND task_id = $3
`
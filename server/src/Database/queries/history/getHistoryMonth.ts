export const getHistoryMonth: string =
`
SELECT * FROM public.timesheet
WHERE resource_id = $1
AND EXTRACT(MONTH FROM start_time) = $2
AND EXTRACT(DAY FROM start_time) < 25
ORDER BY submitted_on DESC
`

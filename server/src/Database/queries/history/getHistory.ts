export const getHistory: string =
`
SELECT * FROM public.timesheet
WHERE resource_id = $1
ORDER BY submitted_on DESC
`

export const getTaskByProjectResource =
`
SELECT task_name, task_id FROM public.resource_tracked_hours
WHERE resource_id = $1
AND project_id = $2
AND EXTRACT(MONTH FROM planned_end) = $3
`
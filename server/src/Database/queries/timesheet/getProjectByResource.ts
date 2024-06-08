export const getProjectByResource = 
`
SELECT  project_id, project_so, project_name FROM public.resource_tracked_hours
WHERE resource_id = $1
AND EXTRACT(MONTH FROM planned_end) = $2
`

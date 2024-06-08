export const getProjectsByResourceMonth: string = `
WITH projects AS (
	SELECT 
  	project_id,
  	project_so, 
  	project_name, 
  	SUM(allocated_hours) AS allocated
	FROM public.resource_tracked_hours
	WHERE resource_id = $1
	AND EXTRACT(MONTH FROM planned_end) = $2
	GROUP BY project_id, project_so, project_name
),
approved AS (
	SELECT 
		project_id, 
		project_so, 
		project_name, 
		COALESCE(SUM(billable), 0) as total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND EXTRACT(MONTH FROM start_time) = $2
	AND EXTRACT(DAY FROM start_time) < 25
	AND status = 'Approved'
	GROUP BY project_id, project_so, project_name
),
pending AS (
	SELECT 
		project_id, 
		project_so, 
		project_name, 
		COALESCE(SUM(billable), 0) as total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND EXTRACT(MONTH FROM start_time) = $2
	AND EXTRACT(DAY FROM start_time) < 25
	AND status = 'Pending'
	GROUP BY project_id, project_so, project_name
)

SELECT 
	projects.*,
	COALESCE(approved.total_clocked, 0) as approved,
	COALESCE(pending.total_clocked, 0) as pending
FROM projects
LEFT JOIN approved ON projects.project_id = approved.project_id
LEFT JOIN pending ON projects.project_id = pending.project_id


`;

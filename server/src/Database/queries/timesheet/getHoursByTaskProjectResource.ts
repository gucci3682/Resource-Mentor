export const getHoursByTaskProjectResource =
`
WITH allocated AS (
	SELECT 
		task_id,
		allocated_hours 
	FROM public.resource_tracked_hours
	WHERE resource_id = $1
	AND project_id = $2
	AND task_id = $3
	AND EXTRACT(MONTH FROM planned_end) = $4
),
approved AS (
	SELECT 
		task_id, 
		COALESCE(SUM(billable), 0) AS total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND project_id = $2
  AND task_id = $3
	AND EXTRACT(MONTH FROM start_time) = $4
	AND EXTRACT(DAY FROM start_time) < 25
	AND status = 'Approved'
	GROUP BY task_id
),
pending AS (
	SELECT 
		task_id, 
		COALESCE(SUM(billable), 0) AS total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND project_id = $2
  AND task_id = $3
	AND EXTRACT(MONTH FROM start_time) = $4
	AND EXTRACT(DAY FROM start_time) < 25
	AND status = 'Pending'
	GROUP BY task_id
)

SELECT 
	allocated.allocated_hours,
	COALESCE(approved.total_clocked, 0) AS approved,
	COALESCE(pending.total_clocked, 0) AS pending
FROM allocated
LEFT JOIN approved ON allocated.task_id = approved.task_id
LEFT JOIN pending ON allocated.task_id = pending.task_id
`
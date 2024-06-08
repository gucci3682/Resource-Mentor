export const getTasksByProjectResource: string = `
WITH tasks AS (
	SELECT 
  	task_id,
  	task_name, 
  	SUM(allocated_hours) AS allocated
	FROM public.resource_tracked_hours
	WHERE resource_id = $1
	AND project_id = $2
	GROUP BY task_id, task_name
),
approved AS (
	SELECT 
		task_id, 
		task_name, 
		COALESCE(SUM(billable), 0) as total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND project_id = $2
	AND status = 'Approved'
	GROUP BY task_id, task_name
),
pending AS (
	SELECT 
		task_id, 
		task_name, 
		COALESCE(SUM(billable), 0) as total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND project_id = $2
	AND status = 'Pending'
	GROUP BY task_id, task_name
)

SELECT 
	tasks.*,
	COALESCE(approved.total_clocked, 0) as approved,
	COALESCE(pending.total_clocked, 0) as pending
FROM tasks
LEFT JOIN approved ON tasks.task_id = approved.task_id
LEFT JOIN pending ON tasks.task_id = pending.task_id
`;

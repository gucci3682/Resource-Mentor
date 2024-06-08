export const getPieChart: string =
`
WITH allocated AS (
	SELECT 
  		resource_id,
		EXTRACT(MONTH FROM planned_end) as planned_month,
  		SUM(allocated_hours) AS allocated
	FROM public.resource_tracked_hours
	WHERE resource_id = $1
	AND EXTRACT(MONTH FROM planned_end) = $2
	GROUP BY resource_id, planned_month
),
approved AS (
	SELECT 
		resource_id,
		EXTRACT(MONTH FROM start_time) as planned_month,
		COALESCE(SUM(billable), 0) as total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND EXTRACT(MONTH FROM start_time) = $2
	AND EXTRACT(DAY FROM start_time) < 25
	AND status = 'Approved'
	GROUP BY resource_id, planned_month
),
pending AS (
	SELECT 
		resource_id,
		timesheet_id,
		EXTRACT(MONTH FROM start_time) as planned_month,
		COALESCE(SUM(billable), 0) as total_clocked
	FROM public.timesheet
	WHERE resource_id = $1
	AND EXTRACT(MONTH FROM start_time) = $2
	AND EXTRACT(DAY FROM start_time) < 25
	AND status = 'Pending'
	GROUP BY resource_id, timesheet_id, planned_month
)

SELECT 
	allocated.*,
	COALESCE(approved.total_clocked, 0) as approved,
	COALESCE(pending.total_clocked, 0) as pending
FROM allocated
LEFT JOIN approved ON allocated.resource_id = approved.resource_id
LEFT JOIN pending ON allocated.resource_id = pending.resource_id
`
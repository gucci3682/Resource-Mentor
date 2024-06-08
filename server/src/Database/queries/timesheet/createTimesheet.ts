export const createTimesheet: string =
  `INSERT INTO public.timesheet (
  project_so, 
  project_name, 
  project_id, 
  resource_name, 
  resource_id, 
  task_name, 
  task_id, 
  start_time, 
  end_time, 
  billable, 
  non_billable, 
  reason, 
  description,
  submitted_on,
  status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`

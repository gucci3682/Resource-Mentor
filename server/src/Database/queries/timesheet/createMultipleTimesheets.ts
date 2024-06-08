export const createMultipleTimesheets: string = 
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
) VALUES %L RETURNING *`

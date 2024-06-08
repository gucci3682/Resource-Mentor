export const authenticateLogin: string = 
`SELECT resource_id, resource_name
FROM public.auth
WHERE email = $1
AND password = $2`

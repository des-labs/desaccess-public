
const pages_default = ['home', 'help', 'db-access', 'cutout', 'tilefinder', 'tables', 'status']
const pages_jupyter = [...pages_default, 'jupyter']
const pages_collaborator = [...pages_default]
const pages_admin = [
	...pages_collaborator, 
	...pages_jupyter, 
	'ticket', 'users', 'notifications'
]

export const rbac_bindings = [
	{
		"role_name": "default",
		"pages": pages_default
	},
	{
		"role_name": "collaborator",
		"pages": pages_collaborator
	},
	{
		"role_name": "jupyter",
		"pages": pages_jupyter
	},
	{
		"role_name": "admin",
		"pages": pages_admin
	},
]

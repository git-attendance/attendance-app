const COMMON_ACCESS = [
	"/",
	"/listings",
	"/listings/:id",
	"/profile/:username",
	"/business-intelligence",
];

export const RBAC_PAGE_ACCESS_MAP: Record<string, string[]> = {
	admin: [...COMMON_ACCESS, "/admin/*"],
	teacher: [...COMMON_ACCESS, "/teacher/*"],
	student: COMMON_ACCESS,
};

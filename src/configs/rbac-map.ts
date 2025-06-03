const COMMON_ACCESS = ["/attendance"];

export const RBAC_PAGE_ACCESS_MAP: Record<string, string[]> = {
	admin: [...COMMON_ACCESS, "/admin/*"],
	teacher: [...COMMON_ACCESS, "/teacher/*"],
	student: COMMON_ACCESS,
};

export interface UserModel {
	_id?: any;
	userName?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	password: string;
	status: "active" | "inactive" | "suspended" | "deactivated" | "archived";
	type: "super_admin" | "admin" | "user";
	role: "super_admin" | "admin" | "teacher" | "student";
	lastActive?: Date;
	avatar?: string[];
	createdAt?: string;
	updatedAt?: string;
}

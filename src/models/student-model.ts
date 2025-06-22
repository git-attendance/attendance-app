export type StudentRemarks =
	| "excuse"
	| "late"
	| "early_dismissal"
	| "sick"
	| "family_emergency"
	| "medical_appointment"
	| "official_business"
	| "suspension"
	| "good_standing"
	| "none";

export interface StudentModel {
	_id: string;
	firstName: string;
	lastName: string;
	middleName?: string;
	studentId: string;
	gradeLevel: string;
	section: string;
	strand?: string;
	email: string;
	dateOfBirth?: Date;
	personId?: string;
	guardian: {
		firstName: string;
		lastName: string;
		middleName?: string;
		email: string;
		phoneNumber?: string;
	};
	remarks?: StudentRemarks;
	color?: string;
	bgColor?: string;
	image: string;
	createdAt: Date;
	updatedAt: Date;
}

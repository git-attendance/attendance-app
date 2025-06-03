import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import { format } from "date-fns";
import type { AttendanceRecord, Student } from "@/models/test-attendance";

interface AttendanceCardProps {
	student: Student;
	attendance: AttendanceRecord;
	className?: string;
}

const AttendanceCard = ({ student, attendance, className }: AttendanceCardProps) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "ENROLLED":
				return "bg-green-100 text-green-800 border-green-200";
			case "LATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "ABSENT":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStrandColor = (strand?: string) => {
		switch (strand?.toLowerCase()) {
			case "stem":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "humss":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "abm":
				return "bg-green-100 text-green-800 border-green-200";
			case "gas":
				return "bg-orange-100 text-orange-800 border-orange-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<Card
			className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-l-blue-500 ${className}`}>
			<CardContent className="p-0">
				<div className="flex">
					{/* Student Photo */}
					<div className="w-32 h-32 bg-gray-100 border-r border-gray-200 flex items-center justify-center">
						{student.photoUrl ? (
							<img
								src={student.photoUrl}
								alt={student.fullName}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
								<span className="text-blue-600 font-semibold text-lg">
									{student.fullName
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</span>
							</div>
						)}
					</div>

					{/* Student Info */}
					<div className="flex-1 p-4">
						<div className="grid grid-cols-2 gap-4 h-full">
							{/* Left Column */}
							<div className="space-y-3">
								<div>
									<h3 className="font-semibold text-lg text-blue-700 mb-1">
										{student.fullName}
									</h3>
									<p className="text-sm text-gray-600">ID: {student.studentId}</p>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<Clock className="h-4 w-4 text-blue-500 mr-2" />
										<div>
											<span className="font-medium text-gray-700">
												TIME IN
											</span>
											<div className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-semibold">
												{format(new Date(attendance.timeIn), "h:mm aa")}
											</div>
										</div>
									</div>

									{attendance.timeOut && (
										<div className="flex items-center text-sm">
											<Clock className="h-4 w-4 text-orange-500 mr-2" />
											<div>
												<span className="font-medium text-gray-700">
													TIME OUT
												</span>
												<div className="bg-gray-100 px-2 py-1 rounded text-orange-600 font-semibold">
													{format(
														new Date(attendance.timeOut),
														"h:mm aa",
													)}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Right Column */}
							<div className="space-y-3">
								<div className="space-y-2">
									<div>
										<span className="text-sm font-medium text-gray-700">
											STATUS
										</span>
										<Badge
											className={`ml-2 ${getStatusColor(attendance.status)}`}>
											{attendance.status}
										</Badge>
									</div>

									{student.strand && (
										<div>
											<span className="text-sm font-medium text-gray-700">
												STRAND
											</span>
											<Badge
												className={`ml-2 ${getStrandColor(student.strand)}`}>
												{student.strand}
											</Badge>
										</div>
									)}
								</div>

								<div className="flex items-center text-sm">
									<BookOpen className="h-4 w-4 text-gray-500 mr-2" />
									<div>
										<span className="font-medium text-gray-700">SECTION</span>
										<div className="bg-gray-100 px-2 py-1 rounded text-gray-700">
											{student.section}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default AttendanceCard;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// interface MessageTemplate {
// 	id: string;
// 	name: string;
// 	subject: string;
// 	content: string;
// 	isActive: boolean;
// 	variables: string[];
// }

const MessagesPage = () => {
	const templates = [
		{
			id: "1",
			name: "Present Alert",
			subject: "Student Presence Notification",
			content:
				"Dear Guardian, your child {studentName} was marked present in {subjectName} class on {date} at {time}.",
			isActive: true,
			variables: ["studentName", "subjectName", "date", "time"],
		},
		{
			id: "2",
			name: "Absent Alert",
			subject: "Student Absence Notification",
			content:
				"Dear Guardian, your child {studentName} was marked absent from {subjectName} class on {date} at {time}. Please contact the school if this is unexpected.",
			isActive: true,
			variables: ["studentName", "subjectName", "date", "time"],
		},
		{
			id: "3",
			name: "Late Arrival",
			subject: "Late Arrival Notice",
			content:
				"Hello, {studentName} arrived late to {subjectName} class today ({date}). Arrival time: {time}.",
			isActive: true,
			variables: ["studentName", "subjectName", "date", "time"],
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
					<p className="text-muted-foreground">
						This is where you can see SMS message templates for guardian notifications
					</p>
				</div>
			</div>

			<div className="grid gap-6">
				{templates.map((template) => (
					<Card key={template.id} className="dark:bg-gray-800">
						<CardHeader>
							<div className="flex justify-between items-start">
								<div className="space-y-1">
									<CardTitle className="flex items-center gap-2">
										{template.name}
									</CardTitle>
									<CardDescription>{template.subject}</CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent>
							<div className="space-y-4">
								<p className="text-sm leading-relaxed">{template.content}</p>
								{template.variables.length > 0 && (
									<div>
										<Label>Variables in this template</Label>
										<div className="flex flex-wrap gap-2 mt-2">
											{template.variables.map((variable) => (
												<Badge key={variable} variant="secondary">
													{variable}
												</Badge>
											))}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default MessagesPage;

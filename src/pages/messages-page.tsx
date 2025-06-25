import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { APP_CONSTANTS } from "@/configs/app-constants";
import { Sparkles } from "lucide-react";

const MessagesPage = () => {
	const templates = [
		{
			id: "1",
			name: "Check-In (Present) Alert",
			subject: "Student Presence Notification",
			content:
				"Dear {guardian}, your child {studentName} has checked- in to {subjectName} class on {date} at {time}.",
			isActive: true,
			variables: ["guardian", "studentName", "subjectName", "date", "time"],
			bgColor: "bg-green-50 dark:bg-green-950", // lighter green for check-in
			borderColor: "border-green-400",
			iconColor: "text-green-600",
		},
		{
			id: "2",
			name: "Check-Out Alert",
			subject: "Student Check-Out Notification",
			content:
				"Dear {guardian}, your child {studentName} has checked- out from {subjectName} class on {date} at {time}. Please contact the school if this is unexpected.",
			isActive: true,
			variables: ["guardian", "studentName", "subjectName", "date", "time"],
			bgColor: "bg-gray-50 dark:bg-gray-900", // lighter gray for check-out
			borderColor: "border-gray-400",
			iconColor: "text-gray-600",
		},
	];

	return (
		<div className="space-y-8  px-4 py-8">
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
						<Sparkles className="w-7 h-7 text-primary" />
						Message Templates
					</h1>
					<p className="text-muted-foreground">
						View and preview SMS templates sent to guardians.
					</p>
				</div>
			</div>

			<div className="grid gap-8">
				{templates.map((template) => (
					<Card
						key={template.id}
						className={`${template.bgColor} border-l-4 ${template.borderColor} shadow-md transition-transform hover:scale-[1.02]`}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div className="space-y-1">
									<CardTitle className="flex items-center gap-2">
										<span
											className={`rounded-full p-1 bg-white/70 dark:bg-black/30 ${template.iconColor}`}>
											<Sparkles className="w-5 h-5" />
										</span>
										{template.name}
									</CardTitle>
									<CardDescription className="text-base font-medium">
										{template.subject}
									</CardDescription>
								</div>
								{template.isActive && (
									<Badge
										variant="outline"
										className="ml-2 bg-green-200 text-green-800 border-green-400">
										Active
									</Badge>
								)}
							</div>
						</CardHeader>

						<CardContent>
							<div className="space-y-4">
								<div className="rounded-md bg-white/80 dark:bg-black/30 p-4 border text-sm leading-relaxed shadow-inner">
									{template.content}
								</div>
								{template.variables.length > 0 && (
									<div>
										<Label className="text-xs text-muted-foreground">
											Variables in this template
										</Label>
										<div className="flex flex-wrap gap-2 mt-2">
											{template.variables.map((variable) => (
												<Badge
													key={variable}
													variant="secondary"
													className="text-xs px-2 py-1">
													{`{${variable}}`}
												</Badge>
											))}
										</div>
									</div>
								)}
								<p className="text-xs text-right text-muted-foreground">
									- {APP_CONSTANTS.APP_SCHOOL_NAME}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default MessagesPage;

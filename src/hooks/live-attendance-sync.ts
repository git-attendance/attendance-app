import { useEffect } from "react";
import { useSocket } from "@/contexts/socket-context";
import { useAttendance } from "@/hooks/use-attendance";
import { toast } from "sonner";

export const useLiveAttendanceSync = () => {
	const { getToday } = useAttendance();
	const socket = useSocket();
	const audio = new Audio("/sounds/bell-notification.mp3");

	useEffect(() => {
		if (!socket) return;

		const handleUpdate = (data: any) => {
			console.log("[Socket] Attendance update received:", data);
			toast.success("New attendance data received");
			getToday.refetch(); // Triggers fresh query
			audio.play().catch((err) => {
				console.warn("Audio play failed:", err);
			});
		};

		socket.on("attendance:update", handleUpdate);

		return () => {
			socket.off("attendance:update", handleUpdate);
		};
	}, [socket, getToday]);
};

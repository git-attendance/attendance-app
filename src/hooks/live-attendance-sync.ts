import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/contexts/socket-context";
import { useAttendance } from "@/hooks/use-attendance";
import { toast } from "sonner";

export const useLiveAttendanceSync = () => {
	const { getToday } = useAttendance();
	const socket = useSocket();
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const isInitializedRef = useRef(false);
	const refetchRef = useRef(getToday.refetch);

	// Update refetch ref when getToday changes
	useEffect(() => {
		refetchRef.current = getToday.refetch;
	}, [getToday.refetch]);

	// Initialize audio only once
	useEffect(() => {
		if (isInitializedRef.current) return;

		audioRef.current = new Audio("/sounds/bell-notification.mp3");
		audioRef.current.preload = "auto";
		audioRef.current.volume = 0.7;
		isInitializedRef.current = true;

		console.log("🔊 Audio initialized");

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	// Stable update handler that doesn't recreate on every render
	const handleUpdate = useCallback((data: any) => {
		console.log("[Socket] 🎯 Attendance update received:", data);

		// Show toast notification
		toast.success("New attendance data received", {
			description: `Student ${data.studentName || "unknown"} checked in`,
		});

		// Refresh attendance data using stable ref
		refetchRef.current();

		// Play notification sound
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current
				.play()
				.then(() => {
					console.log("🔊 Notification sound played");
				})
				.catch((err) => {
					console.warn("🔇 Audio play failed:", err);
				});
		}
	}, []); // No dependencies - all references are stable

	// Socket connection effect - only depends on socket
	useEffect(() => {
		if (!socket) return;

		console.log("🔌 Setting up attendance update listener");

		// Listen for attendance updates
		socket.on("attendance:update", handleUpdate);

		return () => {
			console.log("🧹 Cleaning up attendance update listener");
			socket.off("attendance:update", handleUpdate);
		};
	}, [socket, handleUpdate]); // handleUpdate is now stable

	// Debug function to manually test the notification
	const testNotification = () => {
		console.log("🧪 Testing notification manually...");

		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current
				.play()
				.then(() => {
					console.log("🔊 Manual audio test successful");
					toast.success("Test notification", {
						description: "Audio is working correctly",
					});
				})
				.catch((err) => {
					console.error("🔇 Manual audio test failed:", err);
					toast.error("Audio test failed", {
						description: "Check browser audio permissions",
					});
				});
		}

		// Also test socket connection
		if (socket?.connected) {
			console.log("📡 Socket is connected, sending test event");
			socket.emit("test-attendance", { studentName: "Test Student", action: "test" });
		} else {
			console.warn("📡 Socket is not connected");
			toast.warning("Socket not connected", {
				description: "Real-time updates may not work",
			});
		}
	};

	// Test socket connectivity
	const testSocket = () => {
		if (socket?.connected) {
			socket.emit("ping", Date.now());
			toast.info("Ping sent to server");
		} else {
			toast.error("Socket not connected");
		}
	};

	// Return test functions for debugging
	return { testNotification, testSocket };
};

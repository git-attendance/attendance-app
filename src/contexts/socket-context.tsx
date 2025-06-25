import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

// Determine socket URL based on environment
const getSocketUrl = () => {
	const isLocalhost = location.hostname === "localhost";
	const isDevEnvironment = location.hostname.includes("dev");

	if (isLocalhost) {
		return "http://localhost:5000";
	} else if (isDevEnvironment) {
		return "https://attendance-dev-584ef9a99208.herokuapp.com";
	}
	// Add production URL when available
	return "http://localhost:5000"; // fallback
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const socketUrl = getSocketUrl();
		console.log("🔌 Connecting to socket:", socketUrl);

		const s = io(socketUrl, {
			withCredentials: true,
			transports: ["websocket", "polling"], // fallback to polling if websocket fails
		});
		setSocket(s);

		s.on("connect", () => {
			console.log("✅ Socket connected:", s.id);
		});

		s.on("disconnect", (reason) => {
			console.log("❌ Socket disconnected:", reason);
		});

		s.on("connect_error", (error) => {
			console.error("❌ Socket connection error:", error);
		});

		return () => {
			console.log("🔌 Disconnecting socket");
			s.disconnect();
		};
	}, []); // Empty dependency array - only run once

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = (): Socket | null => {
	const socket = useContext(SocketContext);
	return socket; // Can be null if not connected yet
};

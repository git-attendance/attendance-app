import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const s = io(import.meta.env.VITE_API_URL, {
			withCredentials: true,
		});
		setSocket(s);

		s.on("connect", () => {
			console.log("✅ Socket connected:", s.id);
		});
		s.on("disconnect", () => {
			console.log("❌ Socket disconnected");
		});

		return () => {
			s.disconnect();
		};
	}, []);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = (): Socket => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return socket;
};

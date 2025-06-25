import { useSocket } from "@/contexts/socket-context";
import { Badge } from "@/components/ui/badge";

export const SocketStatus = () => {
	const socket = useSocket();

	if (!socket) {
		return <Badge variant="destructive">Socket: Disconnected</Badge>;
	}

	const isConnected = socket.connected;

	return (
		<Badge variant={isConnected ? "default" : "secondary"}>
			Socket: {isConnected ? `Connected (${socket.id?.slice(0, 8)}...)` : "Connecting..."}
		</Badge>
	);
};

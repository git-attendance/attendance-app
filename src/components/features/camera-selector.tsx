import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface CameraSelectorProps {
	devices: Array<{ deviceId: string; label: string }>;
	selectedDeviceId: string;
	onDeviceChange: (deviceId: string) => void;
	disabled?: boolean;
	isStreaming?: boolean;
	videoRef?: React.RefObject<HTMLVideoElement>;
	switchCamera?: (deviceId: string, videoRef: React.RefObject<HTMLVideoElement>) => void;
}

export const CameraSelector = ({
	devices,
	selectedDeviceId,
	onDeviceChange,
	disabled,
	isStreaming,
	videoRef,
	switchCamera,
}: CameraSelectorProps) => {
	// Always show if we have at least one device
	if (devices?.length === 0) return null;

	return (
		<div className="space-y-2">
			<Label htmlFor="camera-select">
				Select Camera {devices?.length > 1 ? `(${devices?.length} available)` : ""}
			</Label>
			<Select
				value={selectedDeviceId}
				onValueChange={(deviceId) => {
					if (isStreaming && switchCamera && videoRef) {
						switchCamera(deviceId, videoRef);
					} else {
						onDeviceChange(deviceId);
					}
				}}
				disabled={disabled}>
				<SelectTrigger id="camera-select">
					<SelectValue placeholder="Choose a camera" />
				</SelectTrigger>
				<SelectContent>
					{devices
						.filter((device) => device.deviceId.trim() !== "")
						.map((device) => (
							<SelectItem key={device.deviceId} value={device.deviceId}>
								{device.label || "Unnamed Device"}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
};

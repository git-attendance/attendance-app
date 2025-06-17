// // src/contexts/FaceRecognitionContext.tsx
// import { enrollFace, verifyFace } from "@/services/face-recognition-service";
// import React, { createContext, useContext, useState } from "react";

// type FaceRecognitionContextType = {
// 	enroll: (name: string, photo: File) => Promise<any>;
// 	verify: (photo: File) => Promise<any>;
// 	isLoading: boolean;
// 	error: string | null;
// };

// const FaceRecognitionContext = createContext<FaceRecognitionContextType | undefined>(undefined);

// export const FaceRecognitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// 	const [isLoading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);

// 	const enroll = async (name: string, photo: File) => {
// 		try {
// 			setLoading(true);
// 			setError(null);
// 			return await enrollFace(name, photo);
// 		} catch (err: any) {
// 			setError(err.message);
// 			throw err;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const verify = async (photo: File) => {
// 		try {
// 			setLoading(true);
// 			setError(null);
// 			return await verifyFace(photo);
// 		} catch (err: any) {
// 			setError(err.message);
// 			throw err;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<FaceRecognitionContext.Provider value={{ enroll, verify, isLoading, error }}>
// 			{children}
// 		</FaceRecognitionContext.Provider>
// 	);
// };

// export const useFaceRecognition = () => {
// 	const context = useContext(FaceRecognitionContext);
// 	if (!context)
// 		throw new Error("useFaceRecognition must be used within a FaceRecognitionProvider");
// 	return context;
// };

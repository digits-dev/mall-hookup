import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import DissapearingToast from "../Components/Toast/DissapearingToast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("");
	const timeoutId = useRef(null);
	const [isDisappearing, setIsDisappearing] = useState(true);
	

	const handleToast = useCallback((message, messageType, isDissapering = true, duration = 10000, ...params) => {
		document.getElementById("app-content").scrollIntoView(true);
		setMessage(message);
		setMessageType(messageType);
		setIsDisappearing(isDissapering);

		
		if (isDissapering){
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
			}
		
			timeoutId.current = setTimeout(() => {
				setMessage("");
				timeoutId.current = null; 
			},duration);
		}

		params.forEach((param) => {
			if (typeof param === "function") {
				param();
			}
		});
	}, []);

	return (
		<ToastContext.Provider value={{ message, messageType, handleToast }}>
			<DissapearingToast
				type={messageType}
				message={message}
				setMessage={setMessage}
				isDisappearing={isDisappearing}
			/>
			{children}
		</ToastContext.Provider>
	);
}

// Custom hook to use the toast context
export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

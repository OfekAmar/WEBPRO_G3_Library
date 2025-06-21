import React, { useState, useEffect, useRef } from "react";
import { Eye, X } from "lucide-react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import Buttonn from './Buttonn';

function LoginCard({ onClose, onLoginSuccess, onSwitchToRegister }) {
	const popupRef = useRef();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const isFormValid = username.trim() && password.trim();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				onClose?.();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	const handleLogin = async () => {
		const usersRef = ref(db, "users");
		const snapshot = await get(usersRef);
		const allUsers = snapshot.val();

		let matchedUser = null;
		for (const key in allUsers) {
			const user = allUsers[key];
			if (user.email === username && user.password === password) {
				matchedUser = { ...user, index: key };
				break;
			}
		}

		if (!matchedUser) {
			setMsg("Incorrect email or password");
		} else {
			const userData = {
				username: matchedUser.email,
				user_id: matchedUser.user_id,
				userIndex: matchedUser.index,
				name: matchedUser.first_name + " " + matchedUser.last_name,
			};
			sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
			setMsg("Login successful!");
			onLoginSuccess?.(userData);
			onClose?.();
		}
	};

	return (
		<div
			ref={popupRef}
			className="fixed top-16 right-6 bg-[rgba(var(--card),1)] text-copy-primary shadow-xl rounded-lg p-4 w-80 z-50 transition-colors"
		>
			<div className="flex justify-between items-center mb-3">
				<h2 className="text-lg font-bold">Login</h2>
				<button onClick={onClose} className="text-copy-secondary text-xl">
					<X size={20} />
				</button>
			</div>

			<label className="block text-sm font-semibold mb-1">Email</label>
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="w-full p-2 rounded bg-[rgba(var(--border),1)] text-copy-primary mb-3"
				placeholder="example@mail.com"
			/>

			<label className="block text-sm font-semibold mb-1">Password</label>
			<div className="relative mb-3">
				<input
					type={showPassword ? "text" : "password"}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-2 rounded bg-[rgba(var(--border),1)] text-copy-primary"
					placeholder="Enter password"
				/>
				<Eye
					size={18}
					className="absolute right-2 top-2.5 text-copy-secondary cursor-pointer"
					onClick={() => setShowPassword((prev) => !prev)}
				/>
			</div>

			<label className="flex items-center text-sm mb-3">
				<input type="checkbox" className="mr-2" /> Stay logged in
			</label>

			<Buttonn
				onToggle={handleLogin}
				variant={isFormValid ? "loginactive" : "logindisabled"}
				className="w-full justify-center mt-2"
			>
				Login
			</Buttonn>

			{msg && <p className="text-sm text-red-500 text-center mt-2">{msg}</p>}

			<p className="text-xs text-center text-copy-secondary mt-2">
				Don't have an account?{" "}
				<button onClick={onSwitchToRegister} className="text-cta underline">
					Sign up now.
				</button>
			</p>
		</div>
	);
}

export default LoginCard;

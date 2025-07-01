import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, X, CheckCircle } from "lucide-react";
import { db } from "../firebase";
import { ref, get, set, update } from "firebase/database";
import Buttonn from "./Buttonn";

function RegisterCard({ onClose, onSwitchToLogin }) {
	const popupRef = useRef();
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
		birthDate: "",
		Department: "",
		Position: "",
		City: "",
		Address: "",
	});
	const [msg, setMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const departments = [
		"Applied Mathematics",
		"Biotechnology Engineering",
		"Civil Engineering",
		"Electrical Engineering",
		"Industrial and Managment Engineering",
		"Mechanical Engineering",
		"Software Engineering",
	];

	const positions = ["Student", "Lecturer"];

	// Enable register button only when all fields are filled
	const isFormValid = Object.values(form).every((value) => value.trim());

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				onClose?.();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	// Handle input field changes and validate phone format
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "phone") {
			if (!/^[0-9]*$/.test(value)) return;
			if (value.length > 10) return;
			if (value.length >= 2 && !value.startsWith("05")) return;
		}
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// Register new user: validate passwords, check email uniqueness, save to Firebase
	const handleRegister = async () => {
		setMsg("");
		setSuccessMsg("");

		if (form.password !== form.confirmPassword) {
			setMsg("Passwords do not match.");
			return;
		}

		const usersSnap = await get(ref(db, "users"));
		const users = usersSnap.val() || {};

		for (let key in users) {
			if (users[key]?.email === form.email) {
				setMsg("Email already registered.");
				return;
			}
		}

		const mgmtSnap = await get(ref(db, "managment"));
		const userIndex = mgmtSnap.val().users_index + 1;

		const newUser = {
			...form,
			user_id: userIndex,
		};

		await set(ref(db, `users/${userIndex}`), newUser);
		await update(ref(db, "managment"), { users_index: userIndex });

		setSuccessMsg("Registration successful! You can now log in.");
	};

	// Automatically close registration popup after success message timeout
	useEffect(() => {
		if (successMsg) {
			const timer = setTimeout(() => {
				onClose?.();
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [successMsg, onClose]);

	return (
		<div className="fixed inset-0 bg-blur bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center px-2">
			<div
				ref={popupRef}
				className="register-card bg-[rgba(var(--card),1)] rounded-xl shadow-xl w-[90%] max-w-screen-xl h-auto p-10 relative overflow-y-auto text-[rgba(var(--copy-primary),1)]"
			>
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-lg font-bold">Sign Up</h2>
					<button onClick={onClose} className="text-copy-secondary text-xl">
						<X size={20} />
					</button>
				</div>

				{successMsg && (
					<div className="flex items-center gap-2 bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded mb-4 text-sm">
						<CheckCircle size={18} />
						{successMsg}
					</div>
				)}
				{msg && <p className="text-sm text-red-500 text-center mb-2">{msg}</p>}

				{/* Basic Info */}
				<h3 className="font-medium text-sm border-b border-[rgba(var(--border),1)] mb-2 pb-1">
					Basic Info
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
					<input
						name="first_name"
						placeholder="First Name"
						value={form.first_name}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
					<input
						name="last_name"
						placeholder="Last Name"
						value={form.last_name}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
					<input
						name="birthDate"
						type="date"
						value={form.birthDate}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
					<select
						name="Department"
						value={form.Department}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					>
						<option value="">Select Department</option>
						{departments.map((dep) => (
							<option key={dep} value={dep}>{dep}</option>
						))}
					</select>
					<select
						name="Position"
						value={form.Position}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					>
						<option value="">Select Position</option>
						{positions.map((pos) => (
							<option key={pos} value={pos}>{pos}</option>
						))}
					</select>
				</div>

				{/* Password row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
					<div className="relative">
						<input
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={form.password}
							onChange={handleChange}
							className="w-full p-2 rounded bg-transparent pr-10 border border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
						/>
						{showPassword ? (
							<EyeOff
								size={18}
								className="absolute right-2 top-2.5 text-copy-secondary cursor-pointer"
								onClick={() => setShowPassword(false)}
							/>
						) : (
							<Eye
								size={18}
								className="absolute right-2 top-2.5 text-copy-secondary cursor-pointer"
								onClick={() => setShowPassword(true)}
							/>
						)}
					</div>
					<input
						name="confirmPassword"
						type={showPassword ? "text" : "password"}
						placeholder="Confirm Password"
						value={form.confirmPassword}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
				</div>

				{/* Contacts */}
				<h3 className="font-medium text-sm border-b border-[rgba(var(--border),1)] mb-2 pb-1">
					Contacts
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
					<input
						name="email"
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
					<input
						name="phone"
						placeholder="Phone (starts with 05)"
						value={form.phone}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
				</div>

				{/* Address */}
				<h3 className="font-medium text-sm border-b border-[rgba(var(--border),1)] mb-2 pb-1">
					Address
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
					<input
						name="City"
						placeholder="City"
						value={form.City}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
					<input
						name="Address"
						placeholder="Address"
						value={form.Address}
						onChange={handleChange}
						className="bg-transparent w-full p-2 border rounded border-[rgba(var(--border),1)] text-[rgba(var(--copy-primary),1)]"
					/>
				</div>

				<Buttonn
					onToggle={handleRegister}
					variant={isFormValid ? "registeractive" : "registerdisabled"}
					className="w-full justify-center mt-2"
				>
					Register
				</Buttonn>

				<p className="text-xs text-center mt-3">
					Already have an account?{" "}
					<button onClick={onSwitchToLogin} className="text-[rgba(var(--cta),1)] underline">
						Log in
					</button>
				</p>
			</div>
		</div>
	);
}

export default RegisterCard;

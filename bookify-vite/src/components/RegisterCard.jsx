import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, X, CheckCircle } from "lucide-react";
import { db } from "../firebase";
import { ref, get, set, update } from "firebase/database";
import "/src/utils/register.css";
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "phone") {
			if (!/^[0-9]*$/.test(value)) return;
			if (value.length > 10) return;
			if (value.length >= 2 && !value.startsWith("05")) return;
		}
		setForm((prev) => ({ ...prev, [name]: value }));
	};

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
				className="register-card bg-white rounded-xl shadow-xl w-[90%] max-w-screen-xl h-auto p-10 relative overflow-y-auto"
			>
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-lg font-bold">Sign Up</h2>
					<button onClick={onClose} className="text-gray-500 text-xl">
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
				<h3 className="font-medium text-gray-700 text-sm border-b border-gray-200 mb-2 pb-1">
					Basic Info
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
					<input
						name="first_name"
						placeholder="First Name"
						value={form.first_name}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					/>
					<input
						name="last_name"
						placeholder="Last Name"
						value={form.last_name}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					/>
					<input
						name="birthDate"
						type="date"
						value={form.birthDate}
						onChange={handleChange}
						placeholder="Birthdate"
						className="bg-gray-100 w-full p-2 border rounded"
					/>
					<select
						name="Department"
						value={form.Department}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					>
						<option value="">Select Department</option>
						{departments.map((dep) => (
							<option key={dep} value={dep}>
								{dep}
							</option>
						))}
					</select>
					<select
						name="Position"
						value={form.Position}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					>
						<option value="">Select Position</option>
						{positions.map((pos) => (
							<option key={pos} value={pos}>
								{pos}
							</option>
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
							className="w-full p-2 rounded bg-gray-100 pr-10 border"
						/>
						{showPassword ? (
							<EyeOff
								size={18}
								className="absolute right-2 top-2.5 text-gray-500 cursor-pointer"
								onClick={() => setShowPassword(false)}
							/>
						) : (
							<Eye
								size={18}
								className="absolute right-2 top-2.5 text-gray-500 cursor-pointer"
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
						className="bg-gray-100 w-full p-2 border rounded"
					/>
				</div>

				{/* Contacts */}
				<h3 className="font-medium text-gray-700 text-sm border-b border-gray-200 mb-2 pb-1">
					Contacts
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
					<input
						name="email"
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					/>
					<input
						name="phone"
						placeholder="Phone (starts with 05)"
						value={form.phone}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					/>
				</div>

				{/* Address */}
				<h3 className="font-medium text-gray-700 text-sm border-b border-gray-200 mb-2 pb-1">
					Address
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
					<input
						name="City"
						placeholder="City"
						value={form.City}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					/>
					<input
						name="Address"
						placeholder="Address"
						value={form.Address}
						onChange={handleChange}
						className="bg-gray-100 w-full p-2 border rounded"
					/>
				</div>

				<Buttonn
					onToggle={handleRegister}
					variant={isFormValid ? "registeractive" : "registerdisabled"}
					className="w-full justify-center mt-2"
				>
					Register
				</Buttonn>

				<p className="text-xs text-center text-gray-600 mt-3">
					Already have an account?{" "}
					<button onClick={onSwitchToLogin} className="text-blue-600 underline">
						Log in
					</button>
				</p>
			</div>
		</div>
	);
}

export default RegisterCard;

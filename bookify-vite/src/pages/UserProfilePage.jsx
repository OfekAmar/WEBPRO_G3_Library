import React, { useEffect, useState } from "react";
import "/src/utils/userProfile.css";
import avatarImage from "/src/utils/user.png";
import { TbLockFilled } from "react-icons/tb";
import { IoSaveSharp } from "react-icons/io5";
import { BiCalendarEvent } from "react-icons/bi";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";

const UserProfile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!user || !user.userIndex) return;
    const fetchData = async () => {
      const snap = await get(ref(db, "users/" + user.userIndex));
      const data = snap.val();
      if (data) {
        setUserData(data);
        setFormData(data);
        setOriginalData(data);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!formData || !originalData) return;
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setIsDirty(isChanged);
  }, [formData, originalData]);

  useEffect(() => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;
    const isComplete = oldPassword && newPassword && confirmNewPassword;
    const matches = newPassword === confirmNewPassword;
    const correctOld = oldPassword === formData?.password;

    if (!isComplete) {
      setPasswordError("");
      setIsPasswordValid(false);
      return;
    }

    if (!matches) {
      setPasswordError("Passwords do not match");
      setIsPasswordValid(false);
      return;
    }

    if (!correctOld) {
      setPasswordError("Old password is incorrect");
      setIsPasswordValid(false);
      return;
    }

    setPasswordError("");
    setIsPasswordValid(true);
  }, [passwordForm, formData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user || !formData) return;
    await update(ref(db, "users/" + user.userIndex), formData);
    setOriginalData(formData);
    setIsDirty(false);
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsDirty(false);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSave = async () => {
    const updated = { ...formData, password: passwordForm.newPassword };
    await update(ref(db, "users/" + user.userIndex), updated);
    setFormData(updated);
    setOriginalData(updated);
    setPasswordModalOpen(false);
    setSaveMessage("Password updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  };

  if (!user) return <p className="text-red-500">You must be logged in to view your profile.</p>;
  if (!formData) return <p>Loading...</p>;

  return (
    <>
      <div className="view-host user-profile">
        <div className="view-wrapper">
          <div className="dx-toolbar">
            <button className="dx-button cancel-button" disabled={!isDirty} onClick={handleCancel}>Cancel</button>
            <button className="dx-button save-button dx-button-success" disabled={!isDirty} onClick={handleSave}>
              <span className="icon-with-text">
                <IoSaveSharp className="icon" />
                Save
              </span>
            </button>
          </div>

          <div className="cards-container ">
            <div className="basic-info-card card">
              <div className="basic-info-top-item d-flex">
                <div className="profile-card">
                  <img src={avatarImage} alt="User" className="form-photo" />
                  <div className="profile-info">
                    <span className="profile-name">{formData.first_name} {formData.last_name}</span>
                    <div className="name-line">
                      <span className="profile-id">ID: {user.userIndex}</span>
                    </div>
                    <div>
                      <button className="dx-button change-password-button" onClick={() => setPasswordModalOpen(true)}>
                        <TbLockFilled /> Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-fields-grid two-cols">
                <Field label="First Name" value={formData.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
                <Field label="Last Name" value={formData.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
              </div>

              <div className="form-fields-grid four-cols">
                <Field label="Department" value={formData.Department} type="select" options={["Applied Mathematics", "Biotechnology Engineering", "Civil Engineering", "Electrical Engineering", "Industrial and Managment Engineering", "Mechanical Engineering", "Software Engineering"]} onChange={(e) => handleChange("Department", e.target.value)} />
                <Field label="Position" value={formData.Position} type="select" options={["Student", "Lecturer"]} onChange={(e) => handleChange("Position", e.target.value)} />
                <div className="input-with-icon">
                  <Field label="Birth Date" value={formData.birthDate || "01/01/1980"} type="date" onChange={(e) => handleChange("birthDate", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="two-cards-row">
              <div className="contacts-card card">
                <h2>Contacts</h2>
                <div className="form-fields-grid">
                  <Field label="Phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  <Field label="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
              </div>
              <div className="address-card card">
                <h2>Address</h2>
                <div className="form-fields-grid">
                  <Field label="City" value={formData.City} onChange={(e) => handleChange("City", e.target.value)} />
                  <Field label="Address" value={formData.Address} onChange={(e) => handleChange("Address", e.target.value)} />
                </div>
              </div>
            </div>

            {isPasswordModalOpen && (
              <div className="modal-overlay">
                <div className="modal-window">
                  <h3 className="modal-title">Change Password</h3>
                  <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Old Password:</label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                    />
                    <label>New Password:</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    />
                    <label>Confirm New Password:</label>
                    <input
                      type="password"
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => handlePasswordChange("confirmNewPassword", e.target.value)}
                    />
                    {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    <div className="modal-actions">
                      <button type="button" className="modal-cancel" onClick={() => setPasswordModalOpen(false)}>Cancel</button>
                      <button
                        type="submit"
                        className={`modal-save ${isPasswordValid ? 'enabled' : 'disabled'}`}
                        disabled={!isPasswordValid}
                        onClick={handlePasswordSave}
                      >
                        <IoSaveSharp className="icon" />
                        Save
                      </button>


                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
        {saveMessage && <div className="save-toast">{saveMessage}</div>}
      </div>
      <Footer />
    </>
  );
};

const Field = ({ label, value, type = "text", options = [], onChange, fullWidth = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={fullWidth ? "full-width" : ""}>
      <label>{label}:</label>
      {type === "select" ? (
        <div className={`select-wrapper ${isOpen ? "open" : ""}`}>
          <select
            className="dx-input"
            defaultValue={value}
            onMouseDown={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={(e) => {
              onChange?.(e);
              setIsOpen(false);
            }}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          className={`dx-input ${type === "date" ? "date-input" : ""}`}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default UserProfile;

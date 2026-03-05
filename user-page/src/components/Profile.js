import { useState } from 'react';
import { useUser } from '../context/UserContext';
import './Profile.css';

function Profile() {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    address: user.address
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      address: user.address
    });
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1 className="profile-title">User Dashboard</h1>
      </div>

      {/* Profile Header Card */}
      <div className="profile-banner">
        <div className="profile-avatar">
          <span>{user.name.charAt(0)}</span>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>Meter: {user.meterSerial}</p>
        </div>
        {!isEditing && (
          <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* Personal Information */}
      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">Personal Information</h3>
          <p className="section-subtitle">Your account information</p>
        </div>
        <form onSubmit={handleSave} className="info-form">
          <div className="info-grid">
            <div className="info-field">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="editable-input"
                />
              ) : (
                <div className="readonly-input">{user.name}</div>
              )}
            </div>

            <div className="info-field">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="editable-input"
                />
              ) : (
                <div className="readonly-input">{user.email}</div>
              )}
            </div>

            <div className="info-field">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Phone Number
              </label>
              <div className="readonly-input">{user.phone}</div>
              <p className="field-note">Phone number cannot be changed</p>
            </div>

            <div className="info-field">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="editable-input"
                />
              ) : (
                <div className="readonly-input">{user.address}</div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Meter Information */}
      <div className="info-section">
        <div className="section-header">
          <h3 className="section-title">Meter Information</h3>
          <p className="section-subtitle">Details about your electricity meter</p>
        </div>
        <div className="info-grid">
          <div className="info-field">
            <label>Serial Number</label>
            <div className="readonly-input">{user.meterSerial}</div>
          </div>

          <div className="info-field">
            <label>Tariff Rate</label>
            <div className="readonly-input">₹{user.tariffRate}/kWh</div>
          </div>

          <div className="info-field">
            <label>Current Reading</label>
            <div className="readonly-input">{user.currentReading} kWh</div>
          </div>

          <div className="info-field">
            <label>Installation Date</label>
            <div className="readonly-input">{user.installationDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


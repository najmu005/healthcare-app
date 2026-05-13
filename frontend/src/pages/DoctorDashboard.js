import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    Promise.all([
      API.get('/appointments/doctor'),
      API.get('/doctors/profile/me'),
    ]).then(([apts, prof]) => {
      setAppointments(apts.data);
      setProfile(prof.data);
      setProfileForm({
        fees: prof.data.fees,
        bio: prof.data.bio,
        hospital: prof.data.hospital,
        experience: prof.data.experience,
      });
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Appointment ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  const saveProfile = async () => {
    try {
      await API.put('/doctors/profile', profileForm);
      toast.success('Profile updated');
      setEditMode(false);
    } catch {
      toast.error('Update failed');
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h1 className="page-title">Doctor Dashboard</h1>
            <p className="page-subtitle">Dr. {user?.name}</p>
          </div>
          {!user?.isApproved && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '10px', padding: '12px 20px', color: '#92400e', fontSize: '0.875rem' }}>
              ⏳ Account pending admin approval
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          {[
            { label: "Total Appointments", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Today's Appointments", value: stats.today },
            { label: "Completed", value: stats.completed },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>Appointments</div>
          <div className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>My Profile</div>
        </div>

        {activeTab === 'appointments' ? (
          appointments.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📅</div>
              <div className="empty-text">No appointments yet</div>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{apt.patientId?.name || 'N/A'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.patientId?.email}</div>
                      </td>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td style={{ maxWidth: '160px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{apt.symptoms || '-'}</td>
                      <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {apt.status === 'pending' && (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => updateStatus(apt._id, 'approved')}>✓ Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(apt._id, 'rejected')}>✕ Reject</button>
                            </>
                          )}
                          {apt.status === 'approved' && (
                            <button className="btn btn-primary btn-sm" onClick={() => updateStatus(apt._id, 'completed')}>Complete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="card card-body" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif' }}>Profile Details</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editMode ? (
              <>
                {[
                  { label: 'Consultation Fee (₹)', key: 'fees', type: 'number' },
                  { label: 'Experience (years)', key: 'experience', type: 'number' },
                  { label: 'Hospital / Clinic', key: 'hospital', type: 'text' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input type={f.type} className="form-input" value={profileForm[f.key] || ''} onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" rows={4} value={profileForm.bio || ''} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
                </div>
                <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
              </>
            ) : (
              <div>
                {[
                  { label: 'Specialization', value: profile?.specialization },
                  { label: 'Qualification', value: profile?.qualification },
                  { label: 'Experience', value: `${profile?.experience} years` },
                  { label: 'Consultation Fee', value: `₹${profile?.fees}` },
                  { label: 'Hospital', value: profile?.hospital || 'Not set' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.value}</span>
                  </div>
                ))}
                {profile?.bio && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Bio</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

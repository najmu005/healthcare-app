import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAll = async () => {
    try {
      const [s, u, d, a] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/doctors'),
        API.get('/appointments/all'),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setDoctors(d.data);
      setAppointments(a.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const approveDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`);
      toast.success('Doctor approved!');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const toggleBlock = async (id) => {
    try {
      await API.put(`/admin/users/${id}/block`);
      toast.success('Updated');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage the entire platform</p>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          {[
            { label: 'Total Patients', value: stats.totalPatients || 0 },
            { label: 'Total Doctors', value: stats.totalDoctors || 0 },
            { label: 'Total Appointments', value: stats.totalAppointments || 0 },
            { label: 'Pending Approvals', value: stats.pendingDoctors || 0 },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['overview', 'doctors', 'patients', 'appointments'].map(t => (
            <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '16px' }}>Pending Doctor Approvals</h3>
            {doctors.filter(d => !d.userId?.isApproved).length === 0 ? (
              <div className="empty"><div className="empty-text">No pending approvals ✓</div></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Specialization</th><th>Qualification</th><th>Experience</th><th>Action</th></tr></thead>
                  <tbody>
                    {doctors.filter(d => !d.userId?.isApproved).map(doc => (
                      <tr key={doc._id}>
                        <td>Dr. {doc.userId?.name}</td>
                        <td>{doc.specialization}</td>
                        <td>{doc.qualification}</td>
                        <td>{doc.experience} yrs</td>
                        <td><button className="btn btn-success btn-sm" onClick={() => approveDoctor(doc._id)}>✓ Approve</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Doctors */}
        {activeTab === 'doctors' && (
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Specialization</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc._id}>
                    <td>Dr. {doc.userId?.name}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.userId?.email}</td>
                    <td>
                      <span className={`badge ${doc.userId?.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                        {doc.userId?.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {!doc.userId?.isApproved && (
                        <button className="btn btn-success btn-sm" onClick={() => approveDoctor(doc._id)}>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Patients */}
        {activeTab === 'patients' && (
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td><span className={`badge ${u.isBlocked ? 'badge-rejected' : 'badge-approved'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className={`btn btn-sm ${u.isBlocked ? 'btn-success' : 'btn-danger'}`} onClick={() => toggleBlock(u._id)}>
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div className="table-container">
            <table>
              <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id}>
                    <td>{apt.patientId?.name || '-'}</td>
                    <td>Dr. {apt.doctorId?.userId?.name || '-'}</td>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

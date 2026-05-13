import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchAppointments = () => {
    API.get('/appointments/my')
      .then(res => setAppointments(res.data))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await API.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  const filtered = activeTab === 'all' ? appointments : appointments.filter(a => a.status === activeTab);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}</p>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          {[
            { label: 'Total Bookings', value: stats.total, color: 'var(--primary)' },
            { label: 'Pending', value: stats.pending, color: 'var(--warning)' },
            { label: 'Approved', value: stats.approved, color: 'var(--success)' },
            { label: 'Completed', value: stats.completed, color: '#3b82f6' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Book new */}
        <div className="card card-body" style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '4px' }}>Need a consultation?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Book an appointment with our qualified doctors</p>
          </div>
          <Link to="/doctors" className="btn btn-primary">+ Book Appointment</Link>
        </div>

        {/* Appointments */}
        <div className="tabs">
          {['all', 'pending', 'approved', 'completed', 'cancelled'].map(tab => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <div className="empty-text">No {activeTab !== 'all' ? activeTab : ''} appointments found</div>
            <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>Book Now</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(apt => (
                  <tr key={apt._id}>
                    <td>Dr. {apt.doctorId?.userId?.name || 'N/A'}</td>
                    <td>{apt.doctorId?.specialization || '-'}</td>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                    <td style={{ maxWidth: '160px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{apt.notes || apt.symptoms || '-'}</td>
                    <td>
                      {['pending', 'approved'].includes(apt.status) && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(apt._id)}>Cancel</button>
                      )}
                    </td>
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

export default PatientDashboard;

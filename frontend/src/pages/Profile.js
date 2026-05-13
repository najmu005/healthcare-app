import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      const { data } = await API.put('/auth/profile', payload);
      login(data);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '560px' }}>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Update your personal information</p>
        <div className="card">
          <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="doctor-avatar">{user?.name?.[0]}</div>
            <div>
              <div style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: '700' }}>{user?.name}</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.9rem', marginTop: '4px' }}>{user?.email}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '4px', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email (cannot change)</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 9999999999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" placeholder="Your address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep current)</label>
                <input type="password" className="form-input" placeholder="New password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ padding: '14px' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

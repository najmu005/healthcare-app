import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    specialization: '', experience: '', fees: '', qualification: '', hospital: '', bio: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { ...form, role });
      login(data);
      toast.success('Account created successfully!');
      if (role === 'doctor') {
        toast('Your account is pending admin approval.', { icon: '⏳' });
        navigate('/doctor-dashboard');
      } else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '40px 24px' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join MedBook today</p>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          {['patient', 'doctor'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                flex: 1, padding: '12px', border: `2px solid ${role === r ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: '10px', background: role === r ? 'var(--primary)' : 'white',
                color: role === r ? 'white' : 'var(--text)', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '0.95rem', transition: 'all 0.2s'
              }}
            >
              {r === 'patient' ? '👤 Patient' : '🩺 Doctor'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" placeholder="+91 9999999999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>

          {role === 'doctor' && (
            <>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select className="form-input form-select" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required>
                  <option value="">Select specialization</option>
                  {['Cardiologist','Dermatologist','Neurologist','Orthopedic','Pediatrician','Gynecologist','General','Ophthalmologist','ENT','Psychiatrist'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Experience (yrs)</label>
                  <input type="number" className="form-input" placeholder="5" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input type="number" className="form-input" placeholder="500" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input className="form-input" placeholder="MBBS, MD" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Hospital / Clinic</label>
                <input className="form-input" placeholder="City Hospital" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

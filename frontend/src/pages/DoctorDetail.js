import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const timeSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'];

const DoctorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ date: '', time: '', symptoms: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/doctors/${id}`)
      .then(res => setDoctor(res.data))
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (user.role === 'doctor') { toast.error('Doctors cannot book appointments'); return; }
    setSubmitting(true);
    try {
      await API.post('/appointments/book', { doctorId: id, ...booking });
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!doctor) return <div className="loading">Doctor not found</div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
          {/* Doctor Info */}
          <div>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
                padding: '40px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
              }}>
                <div className="doctor-avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem', flexShrink: 0 }}>
                  {doctor.userId?.name?.[0] || 'D'}
                </div>
                <div>
                  <h1 style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', marginBottom: '6px' }}>
                    Dr. {doctor.userId?.name}
                  </h1>
                  <p style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>{doctor.specialization}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{doctor.qualification}</p>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '24px' }}>
                  {[
                    { label: 'Experience', value: `${doctor.experience} Years` },
                    { label: 'Consultation Fee', value: `₹${doctor.fees}` },
                    { label: 'Hospital', value: doctor.hospital || 'Private Clinic' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '10px' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>{m.value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                {doctor.bio && (
                  <div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>About</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{doctor.bio}</p>
                  </div>
                )}
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>Contact</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📧 {doctor.userId?.email}</p>
                  {doctor.userId?.phone && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>📞 {doctor.userId.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ background: 'var(--primary)', padding: '20px 24px' }}>
              <h2 style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontSize: '1.2rem' }}>Book Appointment</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '4px' }}>Consultation fee: ₹{doctor.fees}</p>
            </div>
            <div className="card-body">
              {!user ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Please login to book an appointment</p>
                  <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>Login to Book</button>
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  <div className="form-group">
                    <label className="form-label">Select Date</label>
                    <input
                      type="date"
                      className="form-input"
                      min={today}
                      value={booking.date}
                      onChange={e => setBooking({ ...booking, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                      {timeSlots.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBooking({ ...booking, time: t })}
                          style={{
                            padding: '8px 4px',
                            border: `2px solid ${booking.time === t ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: '8px',
                            background: booking.time === t ? 'var(--primary)' : 'white',
                            color: booking.time === t ? 'white' : 'var(--text)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            transition: 'all 0.15s'
                          }}
                        >{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Symptoms / Reason (optional)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Describe your symptoms or reason for visit..."
                      value={booking.symptoms}
                      onChange={e => setBooking({ ...booking, symptoms: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={submitting || !booking.time} style={{ padding: '14px' }}>
                    {submitting ? 'Booking...' : 'Confirm Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

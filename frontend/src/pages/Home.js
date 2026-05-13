import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const specializations = [
  { name: 'Cardiologist', icon: '❤️' },
  { name: 'Dermatologist', icon: '🩺' },
  { name: 'Neurologist', icon: '🧠' },
  { name: 'Orthopedic', icon: '🦴' },
  { name: 'Pediatrician', icon: '👶' },
  { name: 'Gynecologist', icon: '🌸' },
  { name: 'Ophthalmologist', icon: '👁️' },
  { name: 'General', icon: '🏥' },
];

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  useEffect(() => {
    API.get('/doctors').then(res => setFeaturedDoctors(res.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">
            Your Health, Our <span>Priority</span>
          </h1>
          <p className="hero-sub">
            Book appointments with top doctors easily. No waiting, no hassle —
            just quality healthcare at your fingertips.
          </p>
          <div className="hero-btns">
            <Link to="/doctors" className="btn btn-accent" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              🔍 Find a Doctor
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontSize: '1rem', padding: '14px 32px' }}>
              Get Started →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'white', padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { n: '500+', l: 'Registered Doctors' },
              { n: '10K+', l: 'Happy Patients' },
              { n: '50+', l: 'Specializations' },
              { n: '24/7', l: 'Booking Available' },
            ].map((s) => (
              <div key={s.l} className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="page" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <h2 className="page-title">Browse by Specialization</h2>
          <p className="page-subtitle">Find the right specialist for your needs</p>
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {specializations.map((s) => (
              <Link
                key={s.name}
                to={`/doctors?specialization=${s.name}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={{
                  textAlign: 'center',
                  padding: '28px 16px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{s.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: 'white', padding: '60px 0' }}>
        <div className="container">
          <h2 className="page-title" style={{ textAlign: 'center' }}>How It Works</h2>
          <p className="page-subtitle" style={{ textAlign: 'center' }}>Book your appointment in 3 easy steps</p>
          <div className="grid-3">
            {[
              { step: '01', title: 'Create Account', desc: 'Register as a patient to get started with our platform.' },
              { step: '02', title: 'Find a Doctor', desc: 'Search by specialization and view doctor profiles & availability.' },
              { step: '03', title: 'Book Appointment', desc: 'Select a time slot and confirm your appointment instantly.' },
            ].map((item) => (
              <div key={item.step} className="card card-body" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px', height: '60px', background: 'var(--primary)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 16px',
                  fontFamily: 'Syne, sans-serif', fontWeight: '800', color: 'var(--accent)', fontSize: '1.1rem'
                }}>{item.step}</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Doctors */}
      {featuredDoctors.length > 0 && (
        <div className="page">
          <div className="container">
            <h2 className="page-title">Featured Doctors</h2>
            <p className="page-subtitle">Top rated healthcare professionals</p>
            <div className="grid-3">
              {featuredDoctors.map((doc) => (
                <Link key={doc._id} to={`/doctors/${doc._id}`} className="doctor-card">
                  <div className="doctor-card-header">
                    <div className="doctor-avatar">{doc.userId?.name?.[0] || 'D'}</div>
                    <div className="doctor-name">Dr. {doc.userId?.name}</div>
                    <div className="doctor-spec">{doc.specialization}</div>
                  </div>
                  <div className="doctor-card-body">
                    <div className="doctor-meta">
                      <span className="doctor-meta-item">🎓 {doc.qualification}</span>
                      <span className="doctor-meta-item">⏱ {doc.experience} yrs exp</span>
                      <span className="doctor-meta-item">💰 ₹{doc.fees}</span>
                    </div>
                    <button className="btn btn-primary btn-full btn-sm">View Profile</button>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/doctors" className="btn btn-outline">View All Doctors →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--primary-dark)', color: 'rgba(255,255,255,0.7)', padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '8px' }}>⚕ MedBook</p>
          <p style={{ fontSize: '0.875rem' }}>© 2024 Healthcare Appointment System · Built with MERN Stack</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

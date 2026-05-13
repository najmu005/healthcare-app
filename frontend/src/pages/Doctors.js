import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../utils/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [specs, setSpecs] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const spec = searchParams.get('specialization');
    if (spec) setSelectedSpec(spec);
    API.get('/doctors/specializations').then(res => setSpecs(res.data)).catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedSpec) params.specialization = selectedSpec;
    API.get('/doctors', { params })
      .then(res => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedSpec]);

  const filtered = doctors.filter(d =>
    search ? d.userId?.name?.toLowerCase().includes(search.toLowerCase()) || d.specialization?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Find Doctors</h1>
        <p className="page-subtitle">Search from our network of qualified healthcare professionals</p>

        <div className="search-bar">
          <input
            className="form-input search-input"
            placeholder="🔍 Search by name or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-input form-select"
            style={{ width: 'auto', minWidth: '200px' }}
            value={selectedSpec}
            onChange={e => setSelectedSpec(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(search || selectedSpec) && (
            <button className="btn btn-outline" onClick={() => { setSearch(''); setSelectedSpec(''); }}>
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">No doctors found. Try different filters.</div>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid-2">
              {filtered.map((doc) => (
                <Link key={doc._id} to={`/doctors/${doc._id}`} className="doctor-card">
                  <div className="doctor-card-header">
                    <div className="doctor-avatar">{doc.userId?.name?.[0] || 'D'}</div>
                    <div className="doctor-name">Dr. {doc.userId?.name}</div>
                    <div className="doctor-spec">{doc.specialization}</div>
                  </div>
                  <div className="doctor-card-body">
                    <div className="doctor-meta">
                      <span className="doctor-meta-item">🎓 {doc.qualification}</span>
                      <span className="doctor-meta-item">⏱ {doc.experience} yrs</span>
                      {doc.hospital && <span className="doctor-meta-item">🏥 {doc.hospital}</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>₹{doc.fees}</span>
                      <span className="btn btn-primary btn-sm">Book Appointment</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Doctors;

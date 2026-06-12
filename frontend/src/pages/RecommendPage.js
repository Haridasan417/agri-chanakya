import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './RecommendPage.css';

const KARNATAKA_DISTRICTS = [
  'Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban',
  'Bidar','Chamarajanagara','Chikkaballapura','Chikkamagaluru','Chitradurga',
  'Dakshina Kannada','Davangere','Dharwad','Gadag','Hassan',
  'Haveri','Kalaburagi','Kodagu','Kolar','Koppal',
  'Mandya','Mysuru','Raichur','Ramanagara','Shivamogga',
  'Tumakuru','Udupi','Uttara Kannada','Vijayapura','Yadgir',
];

const CROP_ICONS = {
  rice: '🌾', wheat: '🌾', maize: '🌽', cotton: '🌿', sugarcane: '🎋',
  groundnut: '🥜', jowar: '🌾', bajra: '🌾', ragi: '🌾', sunflower: '🌻',
  tomato: '🍅', onion: '🧅', potato: '🥔', default: '🌱',
};

function getCropIcon(name) {
  const key = name?.toLowerCase();
  return CROP_ICONS[key] || CROP_ICONS.default;
}

function SliderField({ label, name, value, min = 0, max = 140, unit = '', onChange }) {
  return (
    <div className="slider-field">
      <div className="slider-label-row">
        <label>{label}</label>
        <span className="slider-value">{value}{unit}</span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      <div className="slider-range-hints">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

const PROFIT_COLORS = ['#2D6A4F', '#40916C', '#74C69D'];

function CropCard({ crop, rank, delay }) {
  const chartData = [{ name: crop.name, score: crop.profit_score }];
  return (
    <div className="crop-card fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="crop-card-header">
        <div className="crop-rank">#{rank}</div>
        <div className="crop-icon">{getCropIcon(crop.name)}</div>
        <div className="crop-info">
          <h3>{crop.name}</h3>
          <span className="crop-season">{crop.season || 'Kharif / Rabi'}</span>
        </div>
        <div className="profit-badge">
          <span className="profit-pct">{crop.profit_score}%</span>
          <span className="profit-label">Profit Score</span>
        </div>
      </div>

      <div className="profit-bar-wrap">
        <ResponsiveContainer width="100%" height={56}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              cursor={false}
              formatter={(v) => [`${v}%`, 'Profit Score']}
              contentStyle={{ borderRadius: 8, fontSize: '0.85rem', border: '1px solid var(--border)' }}
            />
            <Bar dataKey="score" radius={6} barSize={28}>
              <Cell fill={PROFIT_COLORS[rank - 1] || '#74C69D'} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {crop.explanation && (
        <div className="crop-reason">
          <span className="reason-icon">💡</span>
          <p><strong>Recommended because:</strong> {crop.explanation}</p>
        </div>
      )}

      <div className="crop-metrics">
        {crop.yield_range && <span>📦 Yield: {crop.yield_range} q/acre</span>}
        {crop.water_need  && <span>💧 Water: {crop.water_need}</span>}
        {crop.duration    && <span>📅 Duration: {crop.duration}</span>}
      </div>
    </div>
  );
}

export default function RecommendPage() {
  const [form, setForm] = useState({
    N: 70, P: 40, K: 40,
    temperature: 28,
    humidity: 65,
    location: 'Mysuru',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: Number(form.N),
          P: Number(form.P),
          K: Number(form.K),
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          location: form.location,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResults(data.recommendations || data);
    } catch (err) {
      setError(err.message.includes('fetch')
        ? 'Cannot reach the server at localhost:8000. Make sure your backend is running.'
        : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">AI Crop Advisory</div>
        <h1>What should you grow this season?</h1>
        <p>Enter your soil nutrients and field conditions to get personalised crop recommendations.</p>
      </div>

      <div className="recommend-layout">
        {/* ── Form ── */}
        <form className="card recommend-form" onSubmit={handleSubmit}>
          <h2 className="form-section-title">🧪 Soil Nutrients</h2>
          <div className="sliders-grid">
            <SliderField label="Nitrogen (N)" name="N" value={form.N} onChange={handleChange} unit=" kg/ha" />
            <SliderField label="Phosphorus (P)" name="P" value={form.P} onChange={handleChange} unit=" kg/ha" />
            <SliderField label="Potassium (K)" name="K" value={form.K} onChange={handleChange} unit=" kg/ha" />
          </div>

          <h2 className="form-section-title" style={{ marginTop: 24 }}>🌤️ Field Conditions</h2>
          <div className="conditions-grid">
            <SliderField
              label="Temperature" name="temperature"
              value={form.temperature} min={10} max={50}
              unit="°C" onChange={handleChange}
            />
            <SliderField
              label="Humidity" name="humidity"
              value={form.humidity} min={10} max={100}
              unit="%" onChange={handleChange}
            />
          </div>

          <div className="field-group" style={{ marginTop: 20 }}>
            <label className="field-label">📍 District</label>
            <select name="location" value={form.location} onChange={handleChange}>
              {KARNATAKA_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-banner" style={{ marginTop: 16 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 24, padding: '14px' }}
          >
            {loading ? <><span className="btn-spinner" /> Analysing…</> : '🌱 Get Crop Recommendations'}
          </button>
        </form>

        {/* ── Results ── */}
        <div className="results-panel">
          {loading && (
            <div className="card loading-card">
              <div className="spinner" />
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 14, fontFamily: 'Sora, sans-serif' }}>
                Analysing soil data…
              </p>
            </div>
          )}

          {!loading && results && (
            <div>
              <h2 className="results-title">🏆 Top Recommendations</h2>
              {results.slice(0, 3).map((crop, i) => (
                <CropCard key={crop.name || i} crop={crop} rank={i + 1} delay={i * 100} />
              ))}
            </div>
          )}

          {!loading && !results && !error && (
            <div className="card empty-state">
              <div className="empty-icon">🌿</div>
              <p>Fill in your soil details and click <strong>Get Crop Recommendations</strong> to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

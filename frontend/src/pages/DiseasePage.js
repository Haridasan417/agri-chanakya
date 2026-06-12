import React from 'react';

export default function DiseasePage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">AI Disease Detection</div>
        <h1>Identify crop diseases instantly</h1>
        <p>Upload a photo of your plant's leaf and get instant diagnosis with treatment advice.</p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔬</div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>
          Disease Detector coming in Step 4
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>
          TensorFlow.js + PlantVillage model integration
        </p>
      </div>
    </div>
  );
}

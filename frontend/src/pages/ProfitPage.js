import React from 'react';

export default function ProfitPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Profit Calculator</div>
        <h1>Plan your season's earnings</h1>
        <p>Enter your costs and crop details to see expected revenue, break-even, and profit margin.</p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>
          Profit Calculator coming in Step 5
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>
          Revenue, break-even &amp; profit margin projections
        </p>
      </div>
    </div>
  );
}

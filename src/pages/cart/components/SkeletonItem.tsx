import React from 'react';

const SkeletonItem: React.FC = () => (
  <div className="cart-page__skel-item">
    <div className="cart-page__skel-block" style={{ width: '4rem', height: '5rem', flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="cart-page__skel-block" style={{ width: '60%', height: '1rem' }} />
      <div className="cart-page__skel-block" style={{ width: '40%', height: '0.75rem' }} />
      <div className="cart-page__skel-block" style={{ width: '25%', height: '0.75rem' }} />
    </div>
    <div className="cart-page__skel-block" style={{ width: '7rem', height: '2.25rem', borderRadius: '2rem' }} />
  </div>
);

export default SkeletonItem;
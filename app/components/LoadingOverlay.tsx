'use client';

import { useLoadingProgress } from '../lib/hooks/useLoadingProgress';

export const LoadingOverlay = () => {
  const { percent, showOverlay } = useLoadingProgress();

  if (!showOverlay) return null;

  return (
    <div
      id="load-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 70,
        background: '#0a0a0c',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 60px',
        opacity: showOverlay ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: '72px',
          letterSpacing: '-2px',
          color: '#ffffff',
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        LOADING
      </div>
      <div
        style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            animation: 'spin 2s linear infinite',
          }}
        >
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <rect x="20" y="20" width="30" height="30" fill="#ffffff" rx="4" />
          <circle cx="75" cy="30" r="8" fill="#ffffff" />
          <path d="M 35 75 L 55 75 L 50 55 Z" fill="#ffffff" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: '64px',
          letterSpacing: '-1px',
          color: '#ffffff',
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        {percent}%
      </div>
    </div>
  );
};

'use client';

export const ScrollBar = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 60,
        background: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        id="scroll-bar"
        style={{
          height: '100%',
          width: '100%',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          background: 'linear-gradient(90deg, #7c5cff, #4cc9f0)',
        }}
      />
    </div>
  );
};

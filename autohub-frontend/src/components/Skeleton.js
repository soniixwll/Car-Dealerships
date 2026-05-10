import React from 'react';

export function Skeleton({ width = '100%', height = 16, radius = 8, style = {} }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, var(--bg3) 0%, var(--card) 50%, var(--bg3) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function CarCardSkeleton() {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <Skeleton height={180} radius={0} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={20} width="70%" />
        <Skeleton height={14} width="40%" />
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Skeleton height={22} width={70} radius={100} />
          <Skeleton height={22} width={60} radius={100} />
        </div>
        <Skeleton height={28} width="50%" style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}

export function SalonCardSkeleton() {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <Skeleton height={160} radius={0} />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={20} width="60%" />
        <Skeleton height={14} />
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="70%" />
        <Skeleton height={44} radius={10} style={{ marginTop: 6 }} />
      </div>
    </div>
  );
}

export const skeletonStyles = `@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

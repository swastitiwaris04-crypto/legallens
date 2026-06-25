export default function Skeleton({ width = '100%', height = '16px', className = '', borderRadius = '6px' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

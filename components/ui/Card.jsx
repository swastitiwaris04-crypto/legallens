export default function Card({ children, className = '', hoverable = true }) {
  return (
    <div
      className={`${hoverable ? 'card' : 'bg-bg-card border border-border rounded-lg p-6'} ${className}`}
    >
      {children}
    </div>
  );
}

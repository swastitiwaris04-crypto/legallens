export default function Badge({ children, variant = 'standard', className = '' }) {
  const styles = {
    standard: 'bg-cream-100 text-text-secondary border-border',
    red_flag: 'bg-red-50 text-danger border-red-200',
    review: 'bg-amber-50 text-warning border-amber-200',
    success: 'bg-green-50 text-success border-green-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

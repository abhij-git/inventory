export function Alert({ type, message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}

export function Loading() {
  return <div className="loading">Loading...</div>;
}

export function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(value));
}

export function formatDate(dateString) {
  if (!dateString) return '';

  // Backend stores UTC; treat timezone-less strings as UTC, not local time
  const hasTimezone = dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString);
  const utcDate = hasTimezone ? dateString : `${dateString}Z`;

  return new Date(utcDate).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export const TZ = 'America/Chicago';
export const money = (n) => `$${Number(n || 0).toFixed(2)}`;
export const telHref = (p) => `tel:+1${String(p).replace(/\D/g, '').replace(/^1/, '')}`;
export const when = (d) =>
  new Date(d).toLocaleString('en-US', { timeZone: TZ, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
export const dayKey = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: TZ });
export const STATUSES = ['new', 'preparing', 'ready', 'completed', 'cancelled'];
export const STATUS_LABEL = { new: 'New', preparing: 'Preparing', ready: 'Ready for pickup', completed: 'Picked up', cancelled: 'Cancelled' };

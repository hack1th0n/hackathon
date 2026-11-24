import { createElement } from './dom.js';

const statusLabels = {
  active: 'نشط',
  available: 'متاح',
  occupied: 'مشغول',
  maintenance: 'صيانة',
  draft: 'مسودة',
  ended: 'منتهي',
  cancelled: 'ملغي',
  paid: 'مدفوع',
  partial: 'مدفوع جزئياً',
  overdue: 'متأخر',
  pending: 'قيد الانتظار',
};

const statusClasses = {
  active: 'status-positive',
  available: 'status-positive',
  paid: 'status-positive',
  partial: 'status-warning',
  overdue: 'status-danger',
  cancelled: 'status-muted',
  ended: 'status-muted',
  maintenance: 'status-warning',
  draft: 'status-info',
  pending: 'status-info',
  occupied: 'status-info',
};

export function createStatusBadge({ status = '', label } = {}) {
  const badge = createElement('span', 'status-badge');
  const state = String(status).toLowerCase();
  badge.classList.add(statusClasses[state] || 'status-muted');
  badge.textContent = label || statusLabels[state] || status || '—';
  return badge;
}

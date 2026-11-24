import { createElement } from './dom.js';

const typeLabels = {
  success: 'نجاح',
  error: 'خطأ',
  info: 'تنبيه',
};

export function createToast({ message = '', type = 'info', onClose } = {}) {
  const toast = createElement('div', `toast toast-${type}`);
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

  const marker = createElement('span', 'toast-marker', type === 'success' ? '✓' : type === 'error' ? '!' : 'i');
  marker.setAttribute('aria-hidden', 'true');
  const copy = createElement('div', 'toast-copy');
  copy.append(
    createElement('strong', '', typeLabels[type] || typeLabels.info),
    createElement('span', '', message),
  );

  const closeButton = createElement('button', 'toast-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'إغلاق الإشعار');
  if (typeof onClose === 'function') {
    closeButton.addEventListener('click', onClose);
  }

  toast.append(marker, copy, closeButton);
  return toast;
}

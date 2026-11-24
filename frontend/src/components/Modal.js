import { appendContent, createElement } from './dom.js';

let modalSequence = 0;

export function createModal({ open = false, title = '', onClose, children, footer } = {}) {
  const overlay = createElement('div', 'modal-overlay');
  overlay.hidden = !open;
  overlay.setAttribute('aria-hidden', String(!open));

  const dialog = createElement('section', 'modal-dialog');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.tabIndex = -1;
  modalSequence += 1;
  const titleId = `modal-title-${modalSequence}`;
  dialog.setAttribute('aria-labelledby', titleId);

  const heading = createElement('div', 'modal-heading');
  heading.append(createElement('h2', '', title));
  heading.querySelector('h2').id = titleId;

  const closeButton = createElement('button', 'icon-button', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'إغلاق النافذة');
  heading.append(closeButton);

  const body = createElement('div', 'modal-body');
  appendContent(body, children);
  dialog.append(heading, body);

  if (footer !== undefined && footer !== null) {
    const footerElement = createElement('div', 'modal-footer');
    appendContent(footerElement, footer);
    dialog.append(footerElement);
  }

  overlay.append(dialog);

  const restoreTarget = open ? document.activeElement : null;
  const restoreFocus = () => {
    if (restoreTarget instanceof HTMLElement && restoreTarget.isConnected) {
      restoreTarget.focus();
    }
  };
  const close = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    restoreFocus();
  };

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = Array.from(
      dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.hidden);

    if (focusable.length === 0) {
      event.preventDefault();
      dialog.tabIndex = -1;
      dialog.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (open) {
    requestAnimationFrame(() => {
      if (overlay.isConnected) {
        const initialFocus = dialog.querySelector(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        (initialFocus || dialog).focus();
      }
    });
  }

  return overlay;
}

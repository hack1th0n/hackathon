import { createElement } from './dom.js';

export function createTopbar({ title = '', user, onLogout } = {}) {
  const topbar = createElement('header', 'topbar');
  const heading = createElement('div', 'topbar-heading');
  heading.append(
    createElement('p', 'eyebrow', 'نظام إدارة العقارات'),
    createElement('h1', '', title),
  );

  const actions = createElement('div', 'topbar-actions');
  const account = createElement('div', 'topbar-account');
  const fullName = user?.fullName || user?.name || 'مستخدم';
  const initials = fullName.trim().slice(0, 1) || 'م';
  const avatar = createElement('span', 'avatar', initials);
  avatar.setAttribute('aria-hidden', 'true');
  const accountText = createElement('span', 'account-copy');
  accountText.append(
    createElement('strong', '', fullName),
    createElement('small', '', 'مرحباً بعودتك'),
  );
  account.append(avatar, accountText);
  actions.append(account);

  if (typeof onLogout === 'function') {
    const logoutButton = createElement('button', 'button button-quiet', 'تسجيل الخروج');
    logoutButton.type = 'button';
    logoutButton.addEventListener('click', onLogout);
    actions.append(logoutButton);
  }

  topbar.append(heading, actions);
  return topbar;
}

import { createElement } from './dom.js';

const links = [
  { label: 'لوحة المعلومات', path: '/dashboard', icon: '▦' },
  { label: 'العقارات', path: '/properties', icon: '⌂' },
  { label: 'الملاك', path: '/owners', icon: '◇' },
  { label: 'المستأجرون', path: '/tenants', icon: '♙' },
  { label: 'العقود', path: '/leases', icon: '▤' },
  { label: 'الدفعات', path: '/payments', icon: '◉' },
  { label: 'المصروفات', path: '/expenses', icon: '↗' },
];

const roleLabels = {
  admin: 'مدير النظام',
  manager: 'مدير',
  staff: 'موظف',
};

function isActivePath(activePath, path) {
  if (path === '/dashboard') {
    return activePath === '/' || activePath === path;
  }

  return activePath === path || activePath.startsWith(`${path}/`);
}

export function createSidebar({ activePath = '/dashboard', user, onNavigate } = {}) {
  const sidebar = createElement('aside', 'sidebar');
  const brand = createElement('a', 'brand');
  brand.href = '/dashboard';
  brand.setAttribute('aria-label', 'نظام إدارة العقارات - لوحة المعلومات');

  const brandMark = createElement('span', 'brand-mark', 'م');
  brandMark.setAttribute('aria-hidden', 'true');
  const brandText = createElement('span', 'brand-text');
  brandText.append(
    createElement('strong', '', 'مِلك'),
    createElement('small', '', 'إدارة العقارات'),
  );
  brand.append(brandMark, brandText);
  sidebar.append(brand);

  const nav = createElement('nav', 'sidebar-nav');
  nav.setAttribute('aria-label', 'القائمة الرئيسية');
  nav.append(createElement('p', 'nav-caption', 'القائمة'));

  links.forEach(({ label, path, icon }) => {
    const link = createElement('a', 'nav-link');
    link.href = path;
    if (isActivePath(activePath, path)) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }

    const iconElement = createElement('span', 'nav-icon', icon);
    iconElement.setAttribute('aria-hidden', 'true');
    link.append(iconElement, createElement('span', 'nav-label', label));

    if (typeof onNavigate === 'function') {
      link.addEventListener('click', (event) => {
        if (
          event.defaultPrevented
          || event.button !== 0
          || event.metaKey
          || event.ctrlKey
          || event.shiftKey
          || event.altKey
        ) {
          return;
        }

        event.preventDefault();
        onNavigate(path);
      });
    }

    nav.append(link);
  });

  sidebar.append(nav);

  const profile = createElement('div', 'sidebar-profile');
  const initials = (user?.fullName || user?.name || 'م').trim().slice(0, 1);
  const avatar = createElement('span', 'avatar avatar-small', initials || 'م');
  avatar.setAttribute('aria-hidden', 'true');
  const profileText = createElement('span', 'profile-copy');
  profileText.append(
    createElement('strong', '', user?.fullName || user?.name || 'مستخدم'),
    createElement('small', '', roleLabels[user?.role] || 'فريق العمل'),
  );
  profile.append(avatar, profileText);
  sidebar.append(profile);

  return sidebar;
}

import { appendContent, createElement } from '../components/dom.js';
import { createAppShell } from '../components/AppShell.js';
import { createSidebar } from '../components/Sidebar.js';
import { createTopbar } from '../components/Topbar.js';

export function createDashboardLayout({ title, activePath, user, onLogout, children } = {}) {
  const shell = createAppShell({});
  shell.append(createSidebar({ activePath, user }));

  const mainColumn = createElement('div', 'app-main');
  mainColumn.append(createTopbar({ title, user, onLogout }));

  const content = createElement('main', 'page-content');
  content.setAttribute('id', 'main-content');
  appendContent(content, children);
  mainColumn.append(content);
  shell.append(mainColumn);

  return shell;
}

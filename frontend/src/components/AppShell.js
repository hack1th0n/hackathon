import { appendContent, createElement } from './dom.js';

export function createAppShell({ children } = {}) {
  const shell = createElement('div', 'app-shell');
  appendContent(shell, children);
  return shell;
}

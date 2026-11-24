import { appendContent, createElement } from './dom.js';

function getCellValue(column, row) {
  if (typeof column.render === 'function') {
    return column.render(row[column.key], row);
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }

  return row[column.key];
}

export function createDataTable({
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  onRowClick,
} = {}) {
  const container = createElement('div', 'table-scroll');
  const table = createElement('table', 'data-table');
  const head = createElement('thead');
  const headerRow = createElement('tr');

  columns.forEach((column) => {
    const heading = createElement('th', '', column.label || '');
    heading.scope = 'col';
    headerRow.append(heading);
  });

  head.append(headerRow);
  table.append(head);

  const body = createElement('tbody');
  if (loading || rows.length === 0) {
    const stateRow = createElement('tr', 'table-state-row');
    const stateCell = createElement('td', 'table-state');
    stateCell.colSpan = Math.max(columns.length, 1);
    stateCell.setAttribute('role', 'status');
    stateCell.textContent = loading ? 'جارٍ تحميل البيانات…' : emptyMessage;
    stateRow.append(stateCell);
    body.append(stateRow);
  } else {
    rows.forEach((row) => {
      const tableRow = createElement('tr');
      const rowLabel = row.fullName || row.name || row.unitCode || row.id;
      if (typeof onRowClick === 'function') {
        tableRow.tabIndex = 0;
        if (rowLabel !== undefined) {
          tableRow.setAttribute('aria-label', `عرض ${rowLabel}`);
        }

        tableRow.addEventListener('click', () => onRowClick(row));
        tableRow.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onRowClick(row);
          }
        });
      }

      columns.forEach((column) => {
        const cell = createElement('td');
        const value = getCellValue(column, row);
        appendContent(cell, value === undefined || value === null || value === '' ? '—' : value);
        tableRow.append(cell);
      });

      body.append(tableRow);
    });
  }

  table.append(body);
  container.append(table);
  return container;
}

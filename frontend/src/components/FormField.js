import { createElement } from './dom.js';

let fieldSequence = 0;

export function createFormField({
  label = '',
  name = '',
  value = '',
  onChange,
  error,
  type = 'text',
  required = false,
  placeholder = '',
} = {}) {
  fieldSequence += 1;
  const id = `form-field-${fieldSequence}`;
  const field = createElement('div', 'form-field');
  const labelElement = createElement('label', 'form-label', label);
  labelElement.htmlFor = id;

  if (required) {
    const requiredMark = createElement('span', 'required-mark', ' *');
    requiredMark.setAttribute('aria-hidden', 'true');
    labelElement.append(requiredMark);
  }

  const isMultiline = type === 'textarea';
  const input = createElement(isMultiline ? 'textarea' : 'input', 'form-control');
  input.id = id;
  input.name = name;
  input.required = Boolean(required);
  input.placeholder = placeholder;
  input.value = value ?? '';

  if (!isMultiline) {
    input.type = type;
  }

  if (error) {
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    const errorId = `${id}-error`;
    input.setAttribute('aria-describedby', errorId);
    field.append(labelElement, input, createElement('span', 'field-error', error));
    field.querySelector('.field-error').id = errorId;
  } else {
    input.setAttribute('aria-invalid', 'false');
    field.append(labelElement, input);
  }

  if (typeof onChange === 'function') {
    input.addEventListener('input', onChange);
  }

  return field;
}

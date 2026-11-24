export function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined && text !== null) {
    element.textContent = String(text);
  }

  return element;
}

export function appendContent(parent, content) {
  if (content === undefined || content === null || content === false) {
    return;
  }

  if (Array.isArray(content)) {
    content.forEach((item) => appendContent(parent, item));
    return;
  }

  if (content instanceof Node) {
    parent.append(content);
    return;
  }

  parent.append(document.createTextNode(String(content)));
}

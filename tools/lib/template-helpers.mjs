/**
 * Template rendering helpers
 */

export function renderTemplate(template, variables) {
  let result = template;
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
}

/**
 * Render list of items using template
 */
export function renderList(template, items, itemKey = null) {
  return items
    .map((item) => {
      const vars = itemKey ? item[itemKey] : item;
      return renderTemplate(template, vars);
    })
    .join('\n');
}

/**
 * Format camelCase to readable title
 */
export function formatTitle(camelCase) {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default {
  renderTemplate,
  renderList,
  formatTitle,
};

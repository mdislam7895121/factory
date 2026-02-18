'use client';

const THEME_KEY = 'factory-theme';

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;

  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
}

export function ThemeToggle() {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      className="ds-btn ds-btn-ghost ds-btn-sm theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      Toggle theme
    </button>
  );
}

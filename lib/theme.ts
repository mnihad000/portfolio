export const DEFAULT_THEME = "light";

export const THEME_BOOTSTRAP_SCRIPT = `
  (() => {
    const root = document.documentElement;
    const fallbackTheme = "${DEFAULT_THEME}";

    root.dataset.theme = fallbackTheme;
    root.classList.toggle("dark", fallbackTheme === "dark");
    root.style.colorScheme = fallbackTheme;
  })();
`;

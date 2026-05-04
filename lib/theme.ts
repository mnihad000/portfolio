export const THEME_STORAGE_KEY = "nihad.theme";
export const DEFAULT_THEME = "dark";

export const THEME_BOOTSTRAP_SCRIPT = `
  (() => {
    const root = document.documentElement;
    const fallbackTheme = "${DEFAULT_THEME}";

    try {
      const storedTheme = window.localStorage.getItem("${THEME_STORAGE_KEY}");
      const theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : fallbackTheme;

      root.dataset.theme = theme;
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
    } catch {
      root.dataset.theme = fallbackTheme;
      root.classList.toggle("dark", fallbackTheme === "dark");
      root.style.colorScheme = fallbackTheme;
    }
  })();
`;

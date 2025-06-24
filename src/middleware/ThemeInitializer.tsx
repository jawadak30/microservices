import { useEffect, useState, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// Helper to get cookie value by name
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function ThemeInitializer({ children }: Props) {
  const [themeApplied, setThemeApplied] = useState(false);

  useEffect(() => {
    // Read saved theme from cookie instead of localStorage
    const savedTheme = getCookie('vite-ui-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setThemeApplied(true);
  }, []);

  // Don't render children until theme is applied, to avoid flicker
  if (!themeApplied) {
    return null; // or a loading spinner if you want
  }

  return <>{children}</>;
}

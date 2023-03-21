import { useEffect } from 'react';

function useThemeMode(darKMode = false): void {
  useEffect(() => {
    const tmp: HTMLHtmlElement | null = document.querySelector('html');
    if (!tmp) return;

    tmp.classList.remove('is-light-mode');
    tmp.classList.remove('is-dark-mode');
    if (darKMode) tmp.classList.add('is-dark-mode');
    else tmp.classList.add('is-light-mode');
    return () => {
      tmp.classList.remove('is-light-mode');
      tmp.classList.remove('is-dark-mode');
    };
  }, [darKMode]);
}

export default useThemeMode;

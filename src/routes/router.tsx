import { useState, useEffect, useCallback } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

// Convert path with :param to RegExp
function compileRoute(pattern: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  const regexStr = pattern
    .replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    })
    .replace(/\*/g, '.*');

  return {
    regex: new RegExp(`^${regexStr}$`),
    keys,
  };
}

export function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  const { regex, keys } = compileRoute(pattern);
  const match = pathname.match(regex);
  if (!match) return null;

  const params: Record<string, string> = {};
  keys.forEach((key, index) => {
    params[key] = decodeURIComponent(match[index + 1]);
  });
  return params;
}

export function getCleanPath(): string {
  // Support both HTML5 pushState path and hash path (#/app/home)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }
  return window.location.pathname || '/';
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(getCleanPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getCleanPath());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = '#' + to;
    } else {
      window.history.pushState({}, '', to);
    }
    setCurrentPath(to);
    window.scrollTo(0, 0);
  }, []);

  return {
    path: currentPath,
    navigate,
  };
}

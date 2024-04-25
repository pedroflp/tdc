export function fetchApi(path: string, options?: RequestInit) { 
  return fetch(`${process.env.NEXT_PUBLIC_apiBaseUrl}/api/${path}`, {
    ...options,
    cache: "no-cache"
  });
}
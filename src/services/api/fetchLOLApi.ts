export function fetchLOLApi(path: string, options?: RequestInit) { 
  return fetch(`${process.env.NEXT_PUBLIC_apiBaseUrl}/api/lol/${path}`, options);
}
const base = `http://localhost:5001`;

export function getApiUrl(url: string) {
  if (url.startsWith('/'))
    url = url.substring(1);
  return `${base}/${url}`
}
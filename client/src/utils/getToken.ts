export function removeToken() {
  try {
    localStorage.removeItem('mntnstarwars-token');
  } catch (_) {}
}

export function getToken() {
  try {
    return localStorage.getItem('mntnstarwars-token');
  } catch (_) {
    return '';
  }
}

export function setToken(token: string) {
  localStorage.setItem('mntnstarwars-token', token);
}

export function getBearerAuthorization() {
  const token = getToken();
  return {authorization: `Bearer ${token}`};
}
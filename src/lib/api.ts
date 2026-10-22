export const apiFetch = (url: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem("token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, { ...init, headers });
};

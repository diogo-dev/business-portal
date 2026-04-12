export function get(route: string) {
  return fetch(urlOf(route), { credentials: 'include' });
}

export function getServer(route: string, cookieHeader?: string) {
  return fetch(urlOf(route), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: 'no-store',
  });
}

export function post(route: string, body?: unknown) {

  return fetch(urlOf(route), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(body),
  });
}

export function postFormData(route: string, formData: FormData) {

  return fetch(urlOf(route), {
    method: "POST",
    credentials: 'include',
    body: formData,
  });
}

export function patch(route: string, body?: unknown) {

  return fetch(urlOf(route), {
    method: "PATCH",
    headers: { "Content-Type": "application/json"},
    credentials: 'include',
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

export function patchFormData(route: string, formData: FormData) {

  return fetch(urlOf(route), {
    method: "PATCH",
    credentials: 'include',
    body: formData,
  });
}

export function del(route: string) {

  return fetch(urlOf(route), {
    method: "DELETE",
    credentials: 'include',
  });
}

function urlOf(route: string) {
  const connector = route.startsWith("/") ? "" : "/";
  return process.env.NEXT_PUBLIC_API_URL + connector + route;
}

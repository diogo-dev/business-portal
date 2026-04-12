export function hasSessionCookie(): boolean {
  return document.cookie
    .split(';')
    .some((c) => c.trim().startsWith('session_indicator='));
}
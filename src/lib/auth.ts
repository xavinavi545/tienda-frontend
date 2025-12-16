import { writable } from 'svelte/store';
import type { User } from './api';

export type Session = {
  token: string;
  user: User;
} | null;

const KEY = 'tienda_session_v1';

function loadSession(): Session {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export const session = writable<Session>(null);

export function initSession() {
  session.set(loadSession());
}

export function setSession(s: Session) {
  session.set(s);
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
}

export function logout() {
  setSession(null);
}

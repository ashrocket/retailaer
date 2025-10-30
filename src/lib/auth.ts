/**
 * Authentication utilities for blog editor
 */

import type { AstroCookies } from 'astro';
import { getAuthorById } from '../config/authors';

export interface Session {
  authorId: string;
  name: string;
  email?: string;
  linkedinUsername: string;
  picture?: string;
  exp: number;
}

/**
 * Get current session from cookie
 */
export function getSession(cookies: AstroCookies): Session | null {
  const sessionToken = cookies.get('blog_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const sessionData = JSON.parse(atob(sessionToken)) as Session;

    // Check if session expired
    if (sessionData.exp < Date.now()) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Invalid session token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(cookies: AstroCookies): boolean {
  return getSession(cookies) !== null;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export function requireAuth(cookies: AstroCookies, redirectUrl: string = '/blog/login'): Session {
  const session = getSession(cookies);

  if (!session) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  }

  return session;
}

/**
 * Logout - clear session cookie
 */
export function logout(cookies: AstroCookies): void {
  cookies.delete('blog_session', { path: '/' });
}

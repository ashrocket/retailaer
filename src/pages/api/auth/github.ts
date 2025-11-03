/**
 * GitHub OAuth - Initiate Authorization
 * For authors to edit site content via commits
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ redirect, url, locals }) => {
  const runtime = locals.runtime;
  const clientId = runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    console.error('GITHUB_CLIENT_ID not found in env');
    return new Response('GitHub OAuth not configured', { status: 500 });
  }

  const callbackUrl = url.origin + '/api/auth/github/callback';

  // Get returnTo parameter for redirect after auth
  const returnTo = url.searchParams.get('returnTo') || '/';

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  // Build GitHub authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    state: state,
    scope: 'repo', // Need repo access to commit
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params}`;

  // Store state and returnTo in cookies
  const response = redirect(authUrl, 302);
  const cookies = [
    `github_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    `github_return_to=${encodeURIComponent(returnTo)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`
  ];

  response.headers.set('Set-Cookie', cookies.join(', '));

  return response;
};

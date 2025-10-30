/**
 * LinkedIn OAuth - Initiate Authorization
 * Redirects user to LinkedIn for authentication
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ redirect, url, locals }) => {
  // Try multiple ways to access env vars (Cloudflare compatibility)
  const runtime = locals.runtime;
  const clientId = runtime?.env?.LINKEDIN_CLIENT_ID || import.meta.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    console.error('LINKEDIN_CLIENT_ID not found in env');
    return new Response('LinkedIn OAuth not configured', { status: 500 });
  }

  // Determine callback URL based on environment
  const callbackUrl = url.origin + '/api/auth/linkedin/callback';

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  // Build LinkedIn authorization URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    state: state,
    scope: 'openid profile email w_member_social',
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;

  // Store state in cookie for verification in callback
  const response = redirect(authUrl, 302);
  response.headers.set(
    'Set-Cookie',
    `linkedin_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`
  );

  return response;
};

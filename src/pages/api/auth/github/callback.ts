/**
 * GitHub OAuth - Callback Handler
 * Exchanges authorization code for access token
 */

import type { APIRoute } from 'astro';
import { ALLOWED_AUTHORS } from '../../../../config/authors';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect, cookies, url, locals }) => {
  const runtime = locals.runtime;
  const clientId = runtime?.env?.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = runtime?.env?.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('GitHub OAuth env vars not found');
    return new Response('OAuth not configured', { status: 500 });
  }

  // Get authorization code and state from URL
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return redirect(`/?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return redirect('/?error=missing_code');
  }

  // Verify state for CSRF protection
  const savedState = cookies.get('github_oauth_state')?.value;
  if (state !== savedState) {
    return redirect('/?error=invalid_state');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return redirect('/?error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('No access token in response');
      return redirect('/?error=no_access_token');
    }

    // Get user profile from GitHub
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', await profileResponse.text());
      return redirect('/?error=profile_fetch_failed');
    }

    const profile = await profileResponse.json();
    console.log('GitHub profile received:', { login: profile.login, name: profile.name, email: profile.email });

    // Check if user is an authorized author (by email)
    const email = profile.email?.toLowerCase();
    const author = ALLOWED_AUTHORS.find(a => a.email?.toLowerCase() === email);

    if (!author) {
      console.log('Unauthorized user attempted edit access:', email);
      return redirect(`/?error=unauthorized&email=${encodeURIComponent(email || 'no-email')}`);
    }

    console.log('Authorized editor:', author.name);

    // Create editor session
    const sessionData = {
      authorId: author.id,
      name: profile.name || author.name,
      email: profile.email || author.email,
      githubUsername: profile.login,
      githubToken: accessToken, // Store token for making commits
      avatar: profile.avatar_url,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Encode session
    const sessionToken = btoa(JSON.stringify(sessionData));

    // Set editor session cookie
    cookies.set('editor_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Get returnTo destination
    const returnTo = cookies.get('github_return_to')?.value || '/';

    // Clear OAuth cookies
    cookies.delete('github_oauth_state', { path: '/' });
    cookies.delete('github_return_to', { path: '/' });

    // Redirect back with edit mode enabled
    return redirect(decodeURIComponent(returnTo) + '?editMode=true');

  } catch (error) {
    console.error('OAuth callback error:', error);
    return redirect('/?error=server_error');
  }
};

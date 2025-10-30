/**
 * LinkedIn OAuth - Callback Handler
 * Exchanges authorization code for access token and creates session
 */

import type { APIRoute } from 'astro';
import { isAuthorized, getAuthorByLinkedIn } from '../../../../config/authors';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect, cookies, url }) => {
  const clientId = import.meta.env.LINKEDIN_CLIENT_ID;
  const clientSecret = import.meta.env.LINKEDIN_CLIENT_SECRET;
  const jwtSecret = import.meta.env.JWT_SECRET;

  if (!clientId || !clientSecret || !jwtSecret) {
    return new Response('OAuth not configured', { status: 500 });
  }

  // Get authorization code and state from URL
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return redirect(`/blog/login?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return redirect('/blog/login?error=missing_code');
  }

  // Verify state for CSRF protection
  const savedState = cookies.get('linkedin_oauth_state')?.value;
  if (state !== savedState) {
    return redirect('/blog/login?error=invalid_state');
  }

  try {
    // Exchange authorization code for access token
    const callbackUrl = url.origin + '/api/auth/linkedin/callback';

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: callbackUrl,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return redirect('/blog/login?error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', await profileResponse.text());
      return redirect('/blog/login?error=profile_fetch_failed');
    }

    const profile = await profileResponse.json();

    // Extract LinkedIn username from profile URL
    // Profile URL format: https://www.linkedin.com/in/{username}
    const linkedinUrl = profile.sub || ''; // sub contains LinkedIn ID
    const linkedinUsername = linkedinUrl.split('/').pop() || '';

    // Check if user is authorized
    if (!isAuthorized(linkedinUsername)) {
      console.log('Unauthorized user attempted login:', linkedinUsername);
      return redirect('/blog/login?error=unauthorized');
    }

    // Get author details
    const author = getAuthorByLinkedIn(linkedinUsername);
    if (!author) {
      return redirect('/blog/login?error=author_not_found');
    }

    // Create session token (simple JWT-like structure)
    const sessionData = {
      authorId: author.id,
      name: profile.name || author.name,
      email: profile.email || author.email,
      linkedinUsername: linkedinUsername,
      picture: profile.picture,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Encode session (base64 for simplicity - in production use proper JWT)
    const sessionToken = btoa(JSON.stringify(sessionData));

    // Set session cookie
    cookies.set('blog_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear OAuth state cookie
    cookies.delete('linkedin_oauth_state', { path: '/' });

    // Redirect to blog editor
    return redirect('/blog/editor');

  } catch (error) {
    console.error('OAuth callback error:', error);
    return redirect('/blog/login?error=server_error');
  }
};

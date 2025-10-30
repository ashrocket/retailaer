/**
 * LinkedIn OAuth - Callback Handler
 * Exchanges authorization code for access token and creates session
 */

import type { APIRoute } from 'astro';
import { isAuthorized, getAuthorByLinkedIn } from '../../../../config/authors';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect, cookies, url, locals }) => {
  // Try multiple ways to access env vars (Cloudflare compatibility)
  const runtime = locals.runtime;
  const clientId = runtime?.env?.LINKEDIN_CLIENT_ID || import.meta.env.LINKEDIN_CLIENT_ID;
  const clientSecret = runtime?.env?.LINKEDIN_CLIENT_SECRET || import.meta.env.LINKEDIN_CLIENT_SECRET;
  const jwtSecret = runtime?.env?.JWT_SECRET || import.meta.env.JWT_SECRET;

  if (!clientId || !clientSecret || !jwtSecret) {
    console.error('OAuth env vars not found:', { clientId: !!clientId, clientSecret: !!clientSecret, jwtSecret: !!jwtSecret });
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

    console.log('LinkedIn profile received:', JSON.stringify(profile, null, 2));

    // Extract LinkedIn username from profile URL
    // LinkedIn OpenID Connect returns 'sub' as a unique identifier, not the vanity URL
    // We need to extract the username from the profile URL if available
    let linkedinUsername = '';

    // Try to get vanity URL from profile if available
    if (profile.profile) {
      // profile might contain the vanity URL
      linkedinUsername = profile.profile.split('/').pop() || '';
    } else if (profile.sub) {
      // sub is the LinkedIn ID, but we need the vanity username
      // For now, log what we got and try to match
      linkedinUsername = profile.sub.split('/').pop() || '';
    }

    console.log('Extracted username:', linkedinUsername);
    console.log('Authorized usernames:', ['anncederhall', 'lofgrena', 'ashleyraiteri']);

    // Check if user is authorized
    if (!isAuthorized(linkedinUsername)) {
      console.log('Unauthorized user attempted login:', linkedinUsername);
      console.log('Full profile:', profile);
      return redirect(`/blog/login?error=unauthorized&username=${encodeURIComponent(linkedinUsername)}`);
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

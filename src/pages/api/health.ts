import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Health check endpoint that returns the current git commit SHA
 * Used to verify deployment status
 */
export const GET: APIRoute = async () => {
  // Get git commit SHA from environment variable set during build
  const commitSha = import.meta.env.CF_PAGES_COMMIT_SHA ||
                    process.env.CF_PAGES_COMMIT_SHA ||
                    'unknown';

  const branch = import.meta.env.CF_PAGES_BRANCH ||
                 process.env.CF_PAGES_BRANCH ||
                 'unknown';

  return new Response(JSON.stringify({
    status: 'ok',
    commit: commitSha,
    branch: branch,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};

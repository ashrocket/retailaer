import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Feedback API endpoint
 * Creates GitHub issues from user feedback submissions
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { title, body, selections } = await request.json();

    // Validate input
    if (!title || title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // GitHub API details
    const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
    const REPO_OWNER = 'ashrocket';
    const REPO_NAME = 'retailaer';

    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not configured');

      // For development/testing, log feedback instead of failing
      console.log('Feedback submission (no GitHub token):', {
        title,
        body: body?.substring(0, 200),
        selectionsCount: selections?.length || 0
      });

      return new Response(JSON.stringify({
        success: true,
        message: 'Feedback received (logging only - no GitHub integration)',
        note: 'Configure GITHUB_TOKEN in .dev.vars or Cloudflare environment'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create GitHub issue
    const githubResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Retailaer-Feedback-Widget'
        },
        body: JSON.stringify({
          title: `[Feedback] ${title}`,
          body: body || 'No additional details provided.',
          labels: ['feedback', 'user-report']
        })
      }
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API error:', errorText);
      throw new Error('Failed to create GitHub issue');
    }

    const issue = await githubResponse.json();

    return new Response(JSON.stringify({
      success: true,
      issueNumber: issue.number,
      issueUrl: issue.html_url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to submit feedback',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

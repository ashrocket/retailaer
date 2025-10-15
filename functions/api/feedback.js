/**
 * Cloudflare Function to create GitHub issues from user feedback
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { title, body } = await request.json();

    // Validate input
    if (!title || title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // GitHub API details
    const GITHUB_TOKEN = env.GITHUB_TOKEN; // Set in Cloudflare Pages environment variables
    const REPO_OWNER = 'ashrocket';
    const REPO_NAME = 'retailaer';

    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not configured');
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500,
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
      throw new Error('Failed to create issue');
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
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Commit changes to GitHub
 * Creates a commit with page edits and triggers deployment
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get editor session
    const sessionCookie = cookies.get('editor_session')?.value;
    if (!sessionCookie) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = JSON.parse(atob(sessionCookie));

    // Check session expiry
    if (session.exp < Date.now()) {
      return new Response(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { filePath, content, message } = await request.json();

    if (!filePath || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const githubToken = session.githubToken;
    const owner = 'ashrocket';
    const repo = 'retailaer';
    const branch = 'main';

    // Get current file SHA (required for updates)
    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Retailaer-Site-Editor',
        },
      }
    );

    let sha: string | undefined;
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      sha = fileData.sha;
    }

    // Create commit message
    const commitMessage = message || `Update ${filePath}\n\nEdited via web interface by ${session.name}`;

    // Update file via GitHub API
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Retailaer-Site-Editor',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: btoa(content), // Base64 encode content
          sha: sha, // Required for updates
          branch: branch,
          committer: {
            name: session.name,
            email: session.email,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('GitHub commit failed:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        error: errorText,
        filePath: filePath
      });
      return new Response(JSON.stringify({
        error: 'Failed to commit changes',
        status: updateResponse.status,
        details: errorText.substring(0, 200)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await updateResponse.json();

    // Get latest deployment info
    // Note: Cloudflare Pages auto-deploys on push to main
    const deploymentsResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${import.meta.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/retailaer/deployments`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ).catch(() => null);

    let deploymentUrl = 'https://retailaer.us';
    if (deploymentsResponse?.ok) {
      const deployments = await deploymentsResponse.json();
      if (deployments.result?.length > 0) {
        deploymentUrl = deployments.result[0].url || deploymentUrl;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      commit: {
        sha: result.commit.sha,
        url: result.commit.html_url,
      },
      deployment: {
        url: deploymentUrl,
        message: 'Your changes have been committed and will deploy automatically in 1-2 minutes.',
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Commit error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process commit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

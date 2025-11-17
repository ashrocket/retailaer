import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Commit changes to GitHub
 * Applies inline edits directly to .astro files
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

    const { filePath, changes, message } = await request.json();

    if (!filePath || !changes || !Array.isArray(changes)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const githubToken = session.githubToken;
    const owner = 'ashrocket';
    const repo = 'retailaer';
    const branch = 'main';

    // Get current file content from GitHub
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

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      console.error('Failed to fetch file:', errorText);
      return new Response(JSON.stringify({
        error: 'Failed to fetch file from GitHub',
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileData = await fileResponse.json();
    const sha = fileData.sha;

    // Decode the file content from base64 (handle UTF-8 properly)
    let fileContent = decodeURIComponent(escape(atob(fileData.content)));

    // Apply all changes to the file content
    console.log(`Applying ${changes.length} changes to ${filePath}`);
    let changesApplied = 0;
    const failedChanges = [];

    for (const change of changes) {
      const { editableId, originalHtml, currentHtml } = change;

      if (!editableId) {
        console.warn('  ✗ No editable ID provided');
        failedChanges.push(change);
        continue;
      }

      console.log(`Attempting to replace [data-editable="${editableId}"]:`);
      console.log('  Original:', originalHtml.substring(0, 100));
      console.log('  Current:', currentHtml.substring(0, 100));

      // Find the data-editable attribute and its content in the file
      const dataEditablePattern = new RegExp(
        `data-editable="${editableId}"[^>]*>\\s*([\\s\\S]*?)\\s*</(h[1-6]|p|li|a)>`,
        'm'
      );

      const match = fileContent.match(dataEditablePattern);

      if (match) {
        const fullMatch = match[0];
        const tagMatch = fullMatch.match(/^(.*data-editable="[^"]*"[^>]*>)([\s\S]*?)(<\/[^>]+>)$/);

        if (tagMatch) {
          const openingTag = tagMatch[1];
          const closingTag = tagMatch[3];
          const newContent = openingTag + '\n          ' + currentHtml + '\n        ' + closingTag;

          fileContent = fileContent.replace(fullMatch, newContent);
          changesApplied++;
          console.log(`  ✓ Replaced content for ${editableId}`);
        } else {
          console.warn(`  ✗ Could not parse tags for ${editableId}`);
          failedChanges.push(change);
        }
      } else {
        console.warn(`  ✗ Could not find data-editable="${editableId}" in file`);
        failedChanges.push(change);
      }
    }

    console.log(`Applied ${changesApplied} out of ${changes.length} changes`);

    if (failedChanges.length > 0) {
      console.warn('Failed changes:', JSON.stringify(failedChanges, null, 2));
    }

    // If no changes were applied, return error
    if (changesApplied === 0) {
      return new Response(JSON.stringify({
        error: 'No changes could be applied',
        details: 'The text you edited could not be found in the file. This might be because the browser modified the HTML formatting.',
        failedChanges
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create commit message
    const commitMessage = message || `Update ${filePath} via inline editor\n\nApplied ${changesApplied} edits by ${session.name}`;

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
          content: btoa(unescape(encodeURIComponent(fileContent))), // Base64 encode UTF-8 content
          sha: sha,
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

    return new Response(JSON.stringify({
      success: true,
      changesApplied: changesApplied,
      totalChanges: changes.length,
      commit: {
        sha: result.commit.sha,
        url: result.commit.html_url,
      },
      deployment: {
        url: 'https://retailaer.us',
        message: `Your ${changesApplied} changes have been committed and will deploy automatically in 1-2 minutes.`,
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

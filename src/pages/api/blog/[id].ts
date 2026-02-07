import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

export const prerender = false;

/**
 * Blog post API - Get, Update (unpublish), Delete
 * Uses GitHub API for Cloudflare Workers compatibility
 */

// GET - Retrieve a post
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const runtime = locals.runtime;
    const githubToken = runtime?.env?.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const owner = 'ashrocket';
    const repo = 'retailaer';
    const branch = 'main';
    const filePath = `src/content/blog/${id}.json`;

    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
      }
    );

    if (!fileResponse.ok) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileData = await fileResponse.json();
    const content = JSON.parse(decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, '')))));

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PATCH - Update post (e.g., unpublish)
export const PATCH: APIRoute = async ({ params, request, cookies, locals }) => {
  try {
    const session = getSession(cookies);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const runtime = locals.runtime;
    const githubToken = runtime?.env?.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updates = await request.json();
    const owner = 'ashrocket';
    const repo = 'retailaer';
    const branch = 'main';
    const filePath = `src/content/blog/${id}.json`;

    // Get current file
    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
      }
    );

    if (!fileResponse.ok) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileData = await fileResponse.json();
    const existingContent = JSON.parse(decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, '')))));

    // Merge updates
    const updatedPost = {
      ...existingContent,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If publishing, add publishedAt timestamp
    if (updates.status === 'published' && !existingContent.publishedAt) {
      updatedPost.publishedAt = new Date().toISOString();
    }

    // If unpublishing, add unpublishedAt timestamp
    if (updates.status === 'draft' && existingContent.status === 'published') {
      updatedPost.unpublishedAt = new Date().toISOString();
    }

    // Commit updated file
    let commitMessage: string;
    if (updates.status === 'draft' && existingContent.status === 'published') {
      commitMessage = `Unpublish: ${updatedPost.title}\n\nUnpublished by ${session.name}`;
    } else if (updates.status === 'published') {
      commitMessage = `Publish: ${updatedPost.title}\n\nPublished by ${session.name} via Manage`;
    } else {
      commitMessage = `Update: ${updatedPost.title}\n\nUpdated by ${session.name}`;
    }

    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedPost, null, 2)))),
          sha: fileData.sha,
          branch: branch,
          committer: {
            name: session.name,
            email: session.email || 'editor@retailaer.com',
          },
        }),
      }
    );

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      return new Response(JSON.stringify({ error: 'Failed to update post', details: errorText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await commitResponse.json();

    return new Response(JSON.stringify({
      success: true,
      post: updatedPost,
      commit: {
        sha: result.commit.sha,
        url: result.commit.html_url,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Delete a post
export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  try {
    const session = getSession(cookies);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const runtime = locals.runtime;
    const githubToken = runtime?.env?.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const owner = 'ashrocket';
    const repo = 'retailaer';
    const branch = 'main';
    const filePath = `src/content/blog/${id}.json`;

    // Get current file to get SHA and title
    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
      }
    );

    if (!fileResponse.ok) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileData = await fileResponse.json();
    const existingContent = JSON.parse(decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, '')))));

    // Delete file
    const deleteResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Retailaer-Blog-Editor',
        },
        body: JSON.stringify({
          message: `Delete: ${existingContent.title}\n\nDeleted by ${session.name}`,
          sha: fileData.sha,
          branch: branch,
          committer: {
            name: session.name,
            email: session.email || 'editor@retailaer.com',
          },
        }),
      }
    );

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      return new Response(JSON.stringify({ error: 'Failed to delete post', details: errorText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await deleteResponse.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Post deleted successfully',
      commit: {
        sha: result.commit.sha,
        url: result.commit.html_url,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

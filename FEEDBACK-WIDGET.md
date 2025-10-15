# Feedback Widget Setup

The feedback widget allows users to report issues directly from the website. Feedback is automatically posted as GitHub issues.

## Setup

### 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `Retailaer Feedback Widget`
4. Expiration: No expiration (or your preference)
5. Scopes: Check **`repo`** (full control of private repositories)
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)

### 2. Add Token to Cloudflare Pages

1. Go to Cloudflare Dashboard
2. Pages → retailaer → Settings → Environment variables
3. Add variable:
   - **Name:** `GITHUB_TOKEN`
   - **Value:** (paste your GitHub token)
   - **Environment:** Production (and Preview if desired)
4. Click "Save"

### 3. Deploy

```bash
git add -A
git commit -m "Add feedback widget"
git push
```

The widget will appear as a floating button in the bottom-right corner of every page.

## How It Works

1. **User clicks the feedback button** (bottom-right corner)
2. **Panel opens** asking "What's wrong with the website?"
3. **User fills out**:
   - Brief description (required)
   - Details (optional)
   - Email (optional)
4. **Submits feedback**
5. **Cloudflare Function** (`functions/api/feedback.js`) creates a GitHub issue
6. **Issue is created** with:
   - Title: `[Feedback] {user's title}`
   - Body: User's details + page URL + user agent
   - Labels: `feedback`, `user-report`
   - Reporter email (if provided)

## Files

- `src/components/FeedbackWidget.astro` - UI component
- `functions/api/feedback.js` - API endpoint
- `src/layouts/BaseLayout.astro` - Includes widget on all pages

## Customization

### Change Colors

Edit `src/components/FeedbackWidget.astro`:
```css
.feedback-trigger {
  background: var(--color-primary, #0a5c5c); /* Change this */
}
```

### Change Position

Edit `src/components/FeedbackWidget.astro`:
```css
.feedback-widget {
  bottom: 20px;  /* Distance from bottom */
  right: 20px;   /* Distance from right */
}
```

### Change GitHub Repo

Edit `functions/api/feedback.js`:
```javascript
const REPO_OWNER = 'ashrocket';  // Your GitHub username
const REPO_NAME = 'retailaer';   // Your repo name
```

## Troubleshooting

**Widget doesn't appear:**
- Check browser console for errors
- Ensure BaseLayout imports FeedbackWidget

**Feedback doesn't submit:**
- Check Cloudflare Functions logs
- Verify `GITHUB_TOKEN` is set in environment variables
- Check GitHub token has `repo` scope
- Verify repo owner/name are correct in `feedback.js`

**GitHub issues not created:**
- Check token permissions (needs `repo` scope)
- Check Functions logs in Cloudflare Dashboard
- Verify repository exists and token has access

## Security Notes

- GitHub token is stored securely in Cloudflare environment variables
- Token is never exposed to the browser
- Function validates input before creating issues
- Rate limiting is handled by GitHub's API

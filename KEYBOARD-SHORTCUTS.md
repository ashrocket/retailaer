# Keyboard Shortcuts

## Edit Mode Toggle

**Shortcut**: `Cmd+E` (Mac) or `Ctrl+E` (Windows/Linux)

### What it does:

- **Not logged in**: Redirects to GitHub OAuth login, then returns to current page
- **Logged in, edit mode OFF**: Enables edit mode (`?editMode=true`)
- **Logged in, edit mode ON**: Disables edit mode (removes `?editMode=true`)

### Usage:

1. Visit any page on https://retailaer.us
2. Press `Cmd+E` (or `Ctrl+E`)
3. If not authenticated, you'll be taken to GitHub login
4. After authentication, press `Cmd+E` again to enter edit mode
5. Make your edits
6. Press `Cmd+E` to exit edit mode (or click "Save & Deploy" first)

### Notes:

- The shortcut prevents the default browser behavior (search in some browsers)
- Works on all pages that include the BaseLayout
- Requires GitHub OAuth to be configured (see `GITHUB-OAUTH-SETUP-CHECKLIST.md`)
- Only authorized authors can access edit mode (see `src/config/authors.ts`)

### Implementation:

- Global script: `/public/js/edit-mode-shortcut.js`
- Loaded in: `src/layouts/BaseLayout.astro`

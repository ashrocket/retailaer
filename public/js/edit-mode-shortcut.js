/**
 * Global keyboard shortcut for edit mode
 * Cmd+E (Mac) or Ctrl+E (Windows/Linux) to toggle edit mode
 */

document.addEventListener('keydown', (e) => {
  // Check for Cmd+E (Mac) or Ctrl+E (Windows/Linux)
  if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
    e.preventDefault(); // Prevent default browser behavior (search in some browsers)

    const url = new URL(window.location.href);
    const isEditMode = url.searchParams.get('editMode') === 'true';

    // Check if user has editor session cookie
    const hasEditorSession = document.cookie.split(';').some(cookie =>
      cookie.trim().startsWith('editor_session=')
    );

    // If edit mode is active, toggle it off
    if (isEditMode) {
      url.searchParams.delete('editMode');
      window.location.href = url.toString();
      return;
    }

    // If user has editor session, toggle edit mode on
    if (hasEditorSession) {
      url.searchParams.set('editMode', 'true');
      window.location.href = url.toString();
      return;
    }

    // If not logged in, redirect to GitHub login
    window.location.href = '/api/auth/github?returnTo=' + encodeURIComponent(window.location.pathname + window.location.search);
  }
});

# How to Install the Retailaer VSCode Theme

There are two ways to install this theme:

## Method 1: Quick Install (Recommended)

1. **Copy the theme folder to VSCode extensions directory:**

   **macOS/Linux:**
   ```bash
   cp -r .vscode-theme ~/.vscode/extensions/retailaer-theme
   ```

   **Windows (PowerShell):**
   ```powershell
   Copy-Item -Recurse -Path .vscode-theme -Destination $env:USERPROFILE\.vscode\extensions\retailaer-theme
   ```

2. **Reload VSCode:**
   - Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Reload Window" and press Enter

3. **Activate the theme:**
   - Press `Cmd+K Cmd+T` (macOS) or `Ctrl+K Ctrl+T` (Windows/Linux)
   - Select either:
     - **Retailaer Dark** (for dark theme)
     - **Retailaer Light** (for light theme)

## Method 2: Development Mode (For Testing/Editing)

1. **Open the theme folder in VSCode:**
   ```bash
   code .vscode-theme
   ```

2. **Press F5** to launch Extension Development Host
   - A new VSCode window will open with the theme loaded

3. **In the new window:**
   - Press `Cmd+K Cmd+T` (macOS) or `Ctrl+K Ctrl+T` (Windows/Linux)
   - Select "Retailaer Dark" or "Retailaer Light"

4. **Make changes:**
   - Edit the theme JSON files in `themes/`
   - Reload the Extension Development Host window to see changes

## Verify Installation

After installation, you should see:
- Deep teal (`#0a5c5c`) in the status bar (Dark theme)
- Bright yellow (`#f5b800`) accents on active tabs
- Retailaer brand colors throughout the interface

## Troubleshooting

**Theme doesn't appear in the list:**
- Make sure the folder is named exactly `retailaer-theme` in the extensions directory
- Reload VSCode window (`Cmd+Shift+P` → "Reload Window")
- Check that the `package.json` is in the root of the theme folder

**Colors look wrong:**
- Verify you selected the correct theme (Dark vs Light)
- Check if other extensions are overriding colors
- Try disabling other color themes

**Want to customize:**
- Edit the theme files in `.vscode-theme/themes/`
- Modify colors in `retailaer-dark.json` or `retailaer-light.json`
- Reload window to see changes

## Uninstall

To remove the theme:

**macOS/Linux:**
```bash
rm -rf ~/.vscode/extensions/retailaer-theme
```

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Path $env:USERPROFILE\.vscode\extensions\retailaer-theme
```

Then reload VSCode.

## Questions?

For issues or customization help, see the theme files in `.vscode-theme/themes/`.

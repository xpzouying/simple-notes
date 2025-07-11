# Simple Notes

A lightweight macOS menubar notes app built with Tauri and React, featuring Markdown support and GitHub Gist synchronization.

## Features

- 🖊️ **Markdown Editor** - Write notes in Markdown with live preview
- ☁️ **GitHub Gist Sync** - Automatically sync your notes to a private GitHub Gist
- 🎨 **Clean UI** - Minimalist design with shadcn/ui components
- 🌓 **Dark Mode** - Automatic dark mode support based on system preferences
- 📌 **Always Accessible** - Lives in your menubar for quick access

## Installation

### Prerequisites

- macOS 10.15 or later
- Rust (latest stable)
- Node.js 16+
- GitHub Personal Access Token (for Gist sync)

### Download from Releases

Download the latest release from the [Releases page](https://github.com/xpzouying/simple-notes/releases).

**Note for macOS users**: If you encounter the error "Simple Notes is damaged and can't be opened", this is due to macOS Gatekeeper security. To fix this:

1. Open Terminal
2. Navigate to the folder containing the app
3. Run the following command:
   ```bash
   xattr -cr "Simple Notes.app"
   ```
4. Try opening the app again

Alternatively, you can allow the app in System Preferences:
- Go to System Preferences > Security & Privacy > General
- Click "Open Anyway" next to the blocked app message

### Build from Source

```bash
# Clone the repository
git clone https://github.com/xpzouying/simple-notes.git
cd simple-notes

# Install dependencies
npm install

# Build the app
npm run tauri build

# The app will be in src-tauri/target/release/bundle/
```

## Usage

1. Click the menubar icon to open the notes panel
2. Click "Edit" to start writing
3. Click "Save" to sync to GitHub Gist
4. Configure your GitHub token via the Settings button

### GitHub Token Setup

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens/new?scopes=gist)
2. Create a new token with "gist" scope
3. Copy the token and paste it in the app's settings

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Tauri 2.0, Rust
- **Storage**: GitHub Gist API
- **Editor**: React Markdown

## License

MIT License

## Author

[xpzouying](https://haha.ai)
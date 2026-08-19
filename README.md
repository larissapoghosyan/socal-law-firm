# So Cal Legal Group Website

Static web application for So Cal Legal Group, Inc. Built with React, TypeScript, Vite, and Tailwind CSS.

## Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Bundler**: Vite

## Project Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Configuration

Environment variables can be configured in a `.env` file or repository secrets:

- `VITE_SITE_PASSCODE_HASH`: SHA-256 hash of the access passcode.
- `VITE_GOOGLE_SHEETS_URL`: Web app endpoint for Google Sheets form integration.
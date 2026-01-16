# PixelSpec UI

## Project Overview

PixelSpec AI is a self-use developer inspection tool whose final purpose is not to "recreate a UI screenshot visually", but to produce a complete, developer-ready specification in plain readable text that is as close as possible to real CSS inspection.

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

The only requirement is having Node.js & npm installed.

Follow these steps:

```sh
# Step 1: Install the necessary dependencies.
npm i

# Step 2: Start the development server.
npm run dev
```

## Features

- **Split-Analyze-Merge Engine**: Breaks screenshots into tiles for deep pixel analysis.
- **Local Intelligence**: Uses pure code (Canvas API) to extract colors and layout grid.
- **Deep Spec Generation**: Generates CSS-like specs including flexbox, spacing, and typography.
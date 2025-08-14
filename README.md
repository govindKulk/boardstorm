# <img width="181" height="55" alt="boardstorm-logo" src="https://github.com/user-attachments/assets/7d4b1f0a-6ff7-4551-8809-4b219580816b" />

An online collaborative whiteboard for brainstorming and sketching ideas in real time — built with Next.js, TypeScript, and Socket.IO. Think of it as an Excalidraw-inspired canvas with live collaboration.

- Live demo: https://boardstorm.vercel.app

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Author](#author)
- [License](#license)

## Features
- Real-time collaboration powered by WebSockets (Socket.IO)
- Smooth, responsive canvas optimized for modern browsers
- Intuitive drawing experience for brainstorming and planning
- Share a board link to collaborate with others
- Vercel-ready deployment

Note: Exact toolset and capabilities may evolve; check commit history and the live demo for the latest.

## Tech Stack
- Framework: Next.js (React)
- Language: TypeScript
- Real-time: Socket.IO
- Runtime: Node.js
- Hosting: Vercel

## Installation

Prerequisites:
- Node.js 18+ (recommended)
- npm (or your preferred package manager)

Clone and install:
```bash
git clone https://github.com/govindKulk/boardstorm.git
cd boardstorm
npm install
```

Start the dev server:
```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

## Usage
- Start the development server and open the app locally.
- Create or open a board.
- Share the board URL with teammates to collaborate in real time.
- Use the canvas to sketch ideas, plan features, or diagram flows.

Tip: For best results, use a modern Chromium-based browser or Firefox.

### **WATCH VIDEO**
[![Watch the video](https://img.youtube.com/vi/4xPtlVOqG-8/maxresdefault.jpg)](https://www.youtube.com/watch?v=4xPtlVOqG-8)


## Environment Variables

The app can run locally without special configuration, but if you use a separate Socket.IO server or need public URLs, you may configure environment variables.

Create a `.env` file in the project root:

```bash

## DATABASE & NEXTAUTH SECRETS
DATABASE_URL = "mongodb-database-url"
AUTH_SECRET = ""
AUTH_URL = ""

## GITHUB OAUTH
AUTH_GITHUB_ID = ""
AUTH_GITHUB_SECRET = ""

## AI FEATURES
GEMINI_API_KEY = ""
```

## Scripts

Common scripts (your project may have more):

```bash
# Start local development
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Lint the codebase
npm run lint
```

## Deployment

The app is live on Vercel:
- https://boardstorm.vercel.app

To deploy your own:
- Push the repository to GitHub.
- Import the project into Vercel and follow the prompts.
- Set any required environment variables in the Vercel dashboard.
- Trigger a deployment; Vercel handles build and hosting.

## Roadmap
- Enhanced drawing tools (shapes, text, colors)
- Presence indicators and multi-cursor support
- Board persistence and history
- Export/import boards
- Performance optimizations and mobile refinements

Contributions and ideas are welcome!

## Author

- GitHub: [@govindKulk](https://github.com/govindKulk)
- Project: https://github.com/govindKulk/boardstorm
- Live: https://boardstorm.vercel.app

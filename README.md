# OmniPost Studio

**OmniPost Studio** is an AI-powered cross-platform social media campaign generator that transforms a single idea into simultaneous, tailored posts for **LinkedIn**, **Twitter / 𝕏**, and **Instagram**, complete with unique platform-optimized generative visuals.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🧠 Gemini Models & AI Intelligence](#-gemini-models--ai-intelligence)
- [📐 Visual Studio & Aspect Ratio Affordances](#-visual-studio--aspect-ratio-affordances)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start & Setup](#-quick-start--setup)
- [📡 API Endpoints](#-api-endpoints)
- [⚙️ Configuration & Environment Variables](#️-configuration--environment-variables)
- [📄 License](#-license)

---

## ✨ Key Features

### 1. Multi-Platform Tailored Copywriting
- **LinkedIn (Long-Form Thought Leadership)**:
  - Scroll-stopping opening hook and headline.
  - Spaced paragraph structure for mobile readability.
  - Bulleted key takeaways and executive insights.
  - Discussion-driving call-to-action (CTA) and relevant industry hashtags.
  - Character counter with optimal length indicator (1,000–2,000 characters).
- **Twitter / 𝕏 (Short & Punchy)**:
  - Standalone tweet strictly compliant with the 280-character limit with a live character countdown ring.
  - Toggleable **Multi-Tweet Thread Mode** (numbered 1/3, 2/3, 3/3) expanding the core insight.
  - High-impact viral hooks and focused hashtags.
- **Instagram (Visual Storytelling)**:
  - Catchy pre-fold hook in the first sentence (<125 characters).
  - Storytelling caption with clean spacing and aesthetic formatting.
  - High-converting engagement CTA (Save / Share / Link in Bio).
  - Categorized 15–20 hashtag cluster with one-click hashtag copying.

### 2. Tone Customization & Intensity
- Choose from 6 curated tone profiles:
  - 👔 **Professional** (Polished, authoritative, industry leadership)
  - ⚡ **Witty** (Clever, sharp, humorous, engaging)
  - 🚨 **Urgent** (High energy, time-sensitive, action-oriented)
  - 💡 **Thought Leadership** (Analytical, visionary, frameworks)
  - ☕ **Casual & Relatable** (Warm, conversational, human)
  - 🚀 **Inspirational** (Motivational, uplifting, story-driven)
- Continuous **Tone Intensity Slider** (20% to 100%) to modulate nuance and punchiness.

### 3. Interactive Studio Editing & Mockups
- **Dual View Modes**:
  - **Studio Editor**: Real-time textarea editing, character counters, refine chips, and image controls.
  - **Social Feed Preview**: Pixel-perfect simulation of how the post appears inside the LinkedIn feed, Twitter/X dark mode feed card (with verified badge and interaction buttons), and Instagram mobile post card.
- **Refine with Gemini**:
  - Instant polish quick actions (*Punchier Hook*, *Under 270 Chars*, *Emoji Spacing*, *Clean Bullets*, *Save Post CTA*, or custom natural language instructions).
- **Viral Hook Lab**:
  - Powered by `gemini-3.1-flash-lite` to test 5 psychological hook archetypes (Contrarian, Data/Stat, Story, How-To, Curiosity Gap) with one-click application to the post.
- **Campaign Management**:
  - One-click **Copy All Drafts** across all 3 platforms.
  - **Export Markdown (`.md`)** with the full campaign strategy, post bodies, and visual prompts.
  - **Campaign History Drawer**: Automatically stores past drafts in `localStorage` so you never lose an iteration.

---

## 🧠 Gemini Models & AI Intelligence

OmniPost Studio integrates modern `@google/genai` models on the server side:

| Capability | Model | Purpose & Role |
|---|---|---|
| **Social Content Generation** | `gemini-3.8-flash` | High-speed, nuanced multi-platform copy generation across selected tones |
| **Complex Reasoning** | `gemini-4-argon` | Advanced multi-step strategic messaging and enterprise nuance |
| **High-Fidelity Studio Images** | `gemini-3-pro-image-preview` | Studio-quality visuals with 1K, 2K, and 4K resolution support |
| **Fast Visual Generation** | `gemini-nano-banana-2.1` | Rapid generative visuals across diverse aspect ratios |
| **Viral Hook Lab** | `gemini-3.1-flash-lite` | Instant generation of scroll-stopping opening hook angles |

---

## 📐 Visual Studio & Aspect Ratio Affordances

### Aspect Ratio Controls
The application provides explicit affordances to select and override optimal ratios per platform:
- **16:9 Landscape**: Optimal for LinkedIn and Twitter/X feed cards
- **1:1 Square**: Classic Instagram feed and universal square cards
- **4:3 Standard**: Editorial LinkedIn articles and photo posts
- **9:16 Vertical**: Full-screen Instagram Stories and Reels
- **3:4 Portrait**: Mobile-first vertical feed cards
- **2:3 Vertical**: Classic 35mm portrait framing
- **3:2 Landscape**: Standard 35mm landscape photography
- **21:9 Ultrawide**: Cinematic panorama banners

### Resolution Options
- **1K Standard**: Fast, crisp preview (~1024x1024)
- **2K High-Res**: Balanced studio quality (~2048x2048)
- **4K Ultra Studio**: Maximum fidelity rendering (~4096x4096)

### Aesthetic Styles
- Modern Minimalist Studio
- Editorial Photography
- 3D Isometric Glassmorphism
- Vibrant Vector Illustration
- Cyberpunk Neon Cinematic
- Dark Luxury Editorial

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client (React 19)                      │
│                                                             │
│  [Idea & Tone Input]  ──►  [Multi-Platform Studio Grid]     │
│  - 6 Tones + Slider        - LinkedIn (Long-Form)           │
│  - Image Ratio & Size      - Twitter / X (Punchy / Thread)  │
│  - Preset Inspirations     - Instagram (Visual + Tags)      │
│                            - Feed Mockups & Refine Tools    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Server (Node / TypeScript)          │
│                                                             │
│  /api/generate-posts   /api/generate-image  /api/refine-post│
│          │                      │                 │         │
│          ▼                      ▼                 ▼         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           @google/genai Server SDK Client             │  │
│  │           User-Agent: 'aistudio-build'                │  │
│  └──────────────────────────┬────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Gemini Models                         │
│  - gemini-3.8-flash (Text Strategy & Copy)                  │
│  - gemini-3-pro-image-preview (Studio 1K/2K/4K Visuals)     │
│  - gemini-nano-banana-2.1 (Fast Generative Visuals)         │
│  - gemini-3.1-flash-lite (Viral Hook Angle Lab)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher)
- NPM or PNPM
- `GEMINI_API_KEY` (configured in `.env` or set in your environment)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY="your_google_gemini_api_key_here"
PORT=3000
```

### 3. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### `GET /api/health`
Checks backend status and verifies if `GEMINI_API_KEY` is present.
- **Response**: `{ "status": "ok", "hasKey": true, "time": "..." }`

### `POST /api/generate-posts`
Generates simultaneous drafted posts for LinkedIn, Twitter/X, and Instagram along with tailored images.
- **Body**:
  ```json
  {
    "idea": "We just launched Nova: an autonomous AI assistant for creative freelancers.",
    "tone": "witty",
    "toneIntensity": 80,
    "targetAudience": "Freelancers and agency founders",
    "callToAction": "Try free for 14 days",
    "generateImages": true,
    "imageSettings": {
      "model": "gemini-3-pro-image-preview",
      "imageSize": "2K",
      "style": "Modern Minimalist Studio",
      "linkedin": { "aspectRatio": "16:9" },
      "twitter": { "aspectRatio": "16:9" },
      "instagram": { "aspectRatio": "1:1" }
    },
    "textModel": "gemini-3.8-flash"
  }
  ```

### `POST /api/generate-image`
Regenerates an image for a specific platform with customized ratio, size, and prompt.
- **Body**:
  ```json
  {
    "prompt": "Modern creative workspace with glowing holographic interfaces",
    "aspectRatio": "16:9",
    "imageSize": "2K",
    "model": "gemini-3-pro-image-preview",
    "style": "Modern Minimalist Studio",
    "platform": "linkedin"
  }
  ```

### `POST /api/refine-post`
Edits existing post copy with targeted instructions.
- **Body**:
  ```json
  {
    "platform": "twitter",
    "currentText": "Our tool is out now...",
    "instruction": "Cut to under 240 chars with high punchiness",
    "tone": "witty"
  }
  ```

### `POST /api/generate-hooks`
Generates 5 distinct psychological opening hook angles.
- **Body**:
  ```json
  {
    "idea": "We built a tool that speeds up CI/CD builds by 10x",
    "platform": "linkedin",
    "tone": "professional"
  }
  ```

---

## ⚙️ Configuration & Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Your Google Gemini API key. Accessed strictly server-side. |
| `PORT` | No | Server port (defaults to `3000`). |
| `NODE_ENV` | No | Environment mode (`development` or `production`). |

---

## 📄 License
This project is licensed under the **Apache-2.0** License.

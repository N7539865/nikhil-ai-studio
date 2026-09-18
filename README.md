# 🌟 Nikhil AI Studio — Personal AI Creator Command Center

**Nikhil AI Studio** is a complete, private-use creator operating system built specifically for **Nikhil** to manage, script, optimize, schedule, and track Instagram Reels, YouTube Shorts, YouTube long videos, and creative multimedia across multiple channels and brands.

---

## 🎯 Key Features & Modules

1. **Studio Command Center (Dashboard)**
   - Live KPI counters: Total Saved Ideas, Scripts Created, Videos Planned, Draft Videos, Published Videos.
   - Upcoming scheduled content calendar glance.
   - Quick creator actions (1-click script generator, idea generator, titles/hashtags, pre-publish QA checklist).
   - Recent video projects tracker with checklist completion percentages.

2. **Personal AI Copilot (Chat Assistant)**
   - Conversational AI with persistent brand memory.
   - Format toggles: *Instagram Reel*, *YouTube Short*, *YouTube Long Video*, *Post*, *Story*.
   - Language toggles: *Hinglish*, *हिंदी (Hindi)*, *English*.
   - One-touch voice microphone input with real-time speech recognition in Hindi, Hinglish, and English.
   - Copy, Save to Library, and Regenerate actions.

3. **Viral Content Idea Generator**
   - Multi-dimensional filters: Platform, Niche, Category (*Tech, AI, Business, Funny, Educational, Motivational, Gaming, Art, Telecom*), Duration, Evergreen vs. Trending mode.
   - Full idea blueprints: Title, 3-second opening hook, core concept, suggested camera shots, CTA, caption, and hashtags.
   - "Script this" shortcut: Transitions any generated idea directly into the scene-by-scene script studio.

4. **Scene-by-Scene Script Studio**
   - Full retention-optimized video scripts:
     - 3-second scroll-stopping opening hook.
     - Scene breakdown with timestamps, camera angles, visual b-roll cues.
     - Spoken dialogue / voiceover in Hindi, Hinglish, or English.
     - On-Screen Text (OST) overlays and Sound Effect (SFX) directions.
     - Call to Action (CTA).
   - Full in-browser editor modal to tweak timestamps, dialogue, and cues before saving.

5. **High-CTR Titles, Captions & Hashtags**
   - Generates 10 YouTube titles, 10 Shorts/Reel titles, 3 engaging captions, targeted hashtags, and SEO keywords.
   - Transparent creator advice notice explaining realistic search indexing vs algorithmic watch time.

6. **Content Calendar (Monthly, Weekly & List Views)**
   - Schedule posts with platform tags, target publish dates, and peak engagement times.
   - Seamless toggling between Monthly grid, Weekly agenda, and List views.

7. **Video Project Manager ("My Videos")**
   - End-to-end production tracker for each video asset: Title, platform, production stage (*Idea, Script Ready, Recording, Editing, Ready, Published*), thumbnail concept, video file reference name, caption, hashtags, and pre-publish QA.

8. **10-Point Pre-Publish Quality Checklist**
   - Quality control before hitting upload:
     1. Video edited & color graded
     2. High-CTR thumbnail ready (checked at mobile scale)
     3. Title added (< 60 chars)
     4. Description added with timestamps
     5. Hashtags added
     6. Keywords & search tags added
     7. Caption formatted with clean spacing
     8. Clear CTA included
     9. Audio & subtitles reviewed
     10. Ready to publish / scheduled
   - Live completion percentage meter with celebration badge at 100%.

9. **AI Image & Thumbnail Prompt Studio**
   - Generates visual prompts for Midjourney v6, Flux.1, Ideogram, DALL-E 3, Sora, and Runway.
   - Aspect ratio presets: `16:9` (YouTube), `9:16` (Reels/Shorts), `1:1` (Feed), `4:5` (Instagram Portrait).
   - Negative prompts and lighting/style directions included.

10. **Performance & Growth Analytics (Manual & Safe)**
    - Log views, likes, comments, shares, and follower growth per post.
    - Automated engagement rate calculation `(Likes + Comments + Shares) / Views * 100`.
    - Responsive visual SVG growth bar charts.

11. **Multi-Brand & Channel Switcher**
    - Isolated workspaces out-of-the-box:
      - **Personal Creator** (Nikhil — Tech, Gadgets & Creator Growth)
      - **Nikhil Arts** (Fine Art, Timelapse Sketching & Design)
      - **Gaming** (Esports, BGMI, GTA, Funny Moments)
      - **Comedy** (Desi Sketches & Household Humor)
      - **Devpri Telecom** (Smartphones, Accessories, Deals & Telecom)
      - *Custom Brands*: Create unlimited additional workspaces!
    - Every brand has its own isolated scripts, ideas, calendar, projects, analytics, and brand persona settings.

12. **Saved Content Library & Complete Backup**
    - Central repository with category filtering, favorites, copy, and search.
    - **Export Backup (JSON)** and **Import Backup (JSON)** for 100% data portability and zero data loss.

---

## 🛠️ Project Structure

```
nikhil-ai-studio/
├── package.json               # Root scripts and unified dependencies
├── vite.config.ts             # Vite bundler with API proxy to port 5000
├── tailwind.config.js         # Custom studio tokens and color palette
├── postcss.config.js
├── tsconfig.json
├── index.html
├── .env.example               # Template for API keys
├── .env                       # Local environment variables
├── README.md                  # Documentation and guides
├── server/
│   ├── index.js               # Express API backend
│   ├── routes/
│   │   └── ai.js              # Secure AI routing
│   └── providers/
│       ├── gemini.js          # Google Gemini 1.5/2.5 Flash connector
│       ├── openai.js          # OpenAI / OpenRouter connector
│       └── mockGenerator.js   # Offline Hindi/Hinglish/Eng creator generator
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts           # Core TypeScript models
    ├── services/
    │   ├── storageService.ts  # LocalStorage persistence & JSON export/import
    │   ├── aiService.ts       # Frontend client communicating with /api/ai
    │   └── speechService.ts   # Web Speech API (Hindi, Hinglish, English)
    ├── context/
    │   └── StudioContext.tsx  # Global state: active brand, theme, items
    └── components/
        ├── layout/
        │   ├── Header.tsx
        │   ├── Sidebar.tsx
        │   ├── MobileNav.tsx
        │   └── BrandSwitcher.tsx
        ├── dashboard/
        │   └── DashboardOverview.tsx
        ├── assistant/
        │   └── AiAssistantView.tsx
        ├── ideas/
        │   └── IdeaGeneratorView.tsx
        ├── scripts/
        │   └── ScriptGeneratorView.tsx
        ├── titles/
        │   └── TitleHashtagView.tsx
        ├── projects/
        │   └── ProjectManagerView.tsx
        ├── calendar/
        │   └── CalendarView.tsx
        ├── checklist/
        │   └── UploadChecklistView.tsx
        ├── prompts/
        │   └── PromptAssistantView.tsx
        ├── analytics/
        │   └── AnalyticsView.tsx
        ├── saved/
        │   └── SavedLibraryView.tsx
        ├── settings/
        │   └── BrandSettingsView.tsx
        └── common/
            ├── Badge.tsx
            ├── BrandIcons.tsx
            ├── CopyButton.tsx
            ├── Modal.tsx
            └── VoiceInputButton.tsx
```

---

## 🚀 How to Run Locally

### Step 1: Open the Project
```bash
cd C:\Users\deves\.gemini\antigravity\scratch\nikhil-ai-studio
```

### Step 2: Launch Studio (Frontend + Backend)
Run with `npm.cmd` on Windows:
```bash
npm.cmd run dev
```

This starts:
- **Backend API Server**: `http://localhost:5000`
- **Frontend Creator Studio**: `http://localhost:5173`

Open **`http://localhost:5173`** in your browser (Google Chrome or Microsoft Edge recommended for microphone voice input).

---

## 🔑 How to Configure AI API Keys

The app comes equipped with an intelligent **offline creator engine** that works immediately without any API keys.

To connect **live Google Gemini** or **OpenAI**:

1. Open `.env` in the project root:
```env
PORT=5000

# Set provider: 'gemini', 'openai', or 'mock'
AI_PROVIDER=gemini

# Google Gemini API Key (Get free from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI or OpenRouter
OPENAI_API_KEY=
```

2. Restart `npm.cmd run dev`. The studio will automatically detect your key and switch to live generation!

---

## 📱 How to Build an Android Version Later

You can turn Nikhil AI Studio into an Android APK / App using **Capacitor**:

1. In the `nikhil-ai-studio` folder, install Capacitor:
   ```bash
   npm.cmd install @capacitor/core @capacitor/cli @capacitor/android
   ```
2. Initialize Capacitor:
   ```bash
   npx.cmd cap init "Nikhil AI Studio" com.nikhil.aistudio --web-dir dist
   ```
3. Build the production web bundle:
   ```bash
   npm.cmd run build
   ```
4. Add the Android platform:
   ```bash
   npx.cmd cap add android
   ```
5. Open in Android Studio to run on your phone or build an APK:
   ```bash
   npx.cmd cap open android
   ```

*Tip:* You can also use Nikhil AI Studio as a **Progressive Web App (PWA)** directly on your Android phone: open `http://localhost:5173` (or your hosted URL) in mobile Chrome and tap **"Add to Home screen"**.

---

## 🔌 Features Requiring External APIs (Future Roadmap)

| Feature | Requirement | Reason |
|---|---|---|
| **Live YouTube Analytics & Auto-Sync** | Google Cloud Console OAuth 2.0 & YouTube Data API v3 | Requires user authorization to read channel view/subscriber metrics. |
| **Live Instagram Insights** | Meta Developer Account & Instagram Graph API | Requires Facebook Page linking and Instagram Professional Account verification. |
| **Direct 1-Click Publishing** | YouTube Upload API / Instagram Content Publishing API | Requires approved API scopes for video uploads. |
| **Native AI Image Generation directly inside UI** | Imagen 3 API / Flux API / DALL-E 3 API | Currently generates optimized prompt formulas ready to paste into Midjourney, Ideogram, or Flux. |
| **Cloud Multi-Device Database** | Supabase / Firebase / PostgreSQL | Replaces local storage when you want to edit on your phone and laptop simultaneously. |

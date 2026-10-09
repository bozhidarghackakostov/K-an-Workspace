# Kōan Workspace

> **A calm, fast, unified workspace for thinking, writing, organizing, collaborating, and communicating.**

---

## Overview

**Kōan Workspace** merges the best attributes of structured workspace databases (Notion), deep document collaboration (Google Docs), low-friction rapid thought capture (Apple Notes), and contextual asynchronous discussion (Telegram) into an original, distraction-free environment.

Instead of fragmenting work across isolated apps—where documents exist separate from task trackers and discussions happen in disconnected chat rooms—Kōan introduces an **organically linked data architecture**:

`Documents ⟷ Tasks ⟷ Discussions ⟷ Teammates`

Every comment can spawn an actionable task, every task links back to its context document, and every space unites team members under a single cohesive focus.

---

## Features

### 1. Home Command Center
* **Daily Focus & Sync Status**: Real-time sync indicator with personalized greetings and contextual date anchors.
* **"Continue Where You Left Off"**: Horizontal snap-scrolling cards with active collaborator indicators and open discussion counters.
* **Today's Priorities**: Interactive task checklist with optimistic state updates, priority flags, and direct links to parent documents.
* **Contextual Discussion Feed**: Instant view of recent conversations and threads directly tied to ongoing work.
* **Spaces Bento Grid**: Visual entry points into dedicated spaces, tracking page counts, tasks, and discussion threads.

### 2. Spaces Hub & Relational Map
* **Connection Map**: Transparent relationship counter (`X Docs ↔ Y Tasks ↔ Z Chats`) illuminating connected project velocity.
* **Segmented Filtering**: Switch seamlessly between All items, Documents, Tasks, and Discussions.
* **Pinned Briefs & Specifications**: Highlighting foundational documents with active editor presences.
* **Interactive Task Board**: Tasks categorized by status (`To Do`, `In Progress`, `Done`), assignees, and deadlines.
* **Space Channels**: Topic channels (e.g. `#website-redesign`, `#typography-direction`) with live unread indicators.

### 3. Focused Document Canvas
* **Distraction-Free Editing**: Clean typography scale designed for long-form reading and authoring.
* **Autosave Engine**: Persistent background synchronization with visual state feedback (`Saved` / `Saving...`).
* **Collaborator Indicators**: Multi-user avatars reflecting current presence in the document.
* **Attached Contextual Conversation Drawer**: Document-level threads pinned directly to paragraph contexts with a one-click **"Convert to Task"** workflow.
* **Floating Context Toolbar & Keyboard Accessory Bar**: Quick-formatting controls (Bold, Italic, Code, Lists, Checkboxes, Mentions, and Voice memos).

### 4. Contextual Messages & Audio Notes
* **Channel Timelines**: Asynchronous team communication linked to specific documents or spaces.
* **Embedded Document Cards**: Native preview cards allowing teammates to jump directly into referenced document sections.
* **Task Creation Audit Trails**: Visual notification badges showing tasks created directly from chat conversations.
* **Voice Memo Player**: Interactive audio pill with waveform visualization and audio playback states.

### 5. Global Command Palette & Quick Capture
* **Command Palette (`⌘K` / `Ctrl+K`)**: Rapid search across documents, spaces, tasks, notes, and messages with keyboard navigation (`↑`/`↓`/`Enter`).
* **Quick Capture (`⌘N` / `Ctrl+N`)**: Modal and floating mobile action button allowing instantaneous capture of:
  * **Notes** (immediate thought capture)
  * **Tasks** (action items tied to active spaces)
  * **Documents** (new canvases with slash-command scaffolding)
  * **Messages** (contextual posts sent to active channels)

### 6. Design System & Theme Engine
* **Editorial Minimalist Aesthetic**: High-contrast, warm neutral color tokens preventing visual fatigue.
* **System Dark & Light Modes**: Automatic detection with manual toggle and localStorage persistence.
* **Adaptive Navigation**: Collapsible desktop sidebar with nested page hierarchies and a tactile mobile bottom navigation bar.

---

## 🏗️ Architecture

Kōan follows a strict **domain-driven, feature-oriented architecture**. Domain and storage logic are completely separated from presentation components through a typed service facade:

```
src/
├── components/          # Reusable UI & Application Shell
│   ├── shell/           # AppShell, Sidebar, TopBar, BottomNav, CommandPalette, QuickCapture
│   └── ui/              # Design system primitives (Button, Input, Avatar, Badge, Modal, States)
├── context/             # React Context Providers
│   ├── AuthContext.tsx       # Session, authentication boundary & user switching
│   ├── WorkspaceContext.tsx  # Global workspace state, active space, and actions
│   ├── ThemeContext.tsx      # Persistent dark/light mode
│   └── ToastContext.tsx      # System notification toasts
├── features/            # Feature Views (Domain Presentation)
│   ├── auth/            # Login, Sign Up & Teammate quick-switcher
│   ├── home/            # Daily focus & Home command center
│   ├── spaces/          # Space hubs, relationship map, pinned briefs
│   ├── documents/       # Document canvas, attached drawer, block editor
│   ├── messages/        # Contextual chat, embedded doc cards, voice player
│   ├── tasks/           # Dedicated task management & filter board
│   └── inbox/           # Notification updates and mentions
├── routes/              # Client-side router supporting pushState and hash routes
├── services/            # Service facade layer
│   ├── storage/         # IStorageAdapter & LocalStorageAdapter persistence
│   ├── seedData.ts      # Initialized dataset
│   └── index.ts         # workspaceService, documentService, taskService, etc.
└── types/               # TypeScript domain interfaces & entity models
```

---

## 💾 Persistence Layer

The application operates on an abstracted storage adapter pattern (`IStorageAdapter`). Data is never coupled directly to local storage inside UI components:

```typescript
export interface IStorageAdapter {
  getWorkspace(id: ID): Promise<Workspace | null>;
  saveWorkspace(workspace: Workspace): Promise<void>;
  getDocuments(workspaceId: ID): Promise<Document[]>;
  saveDocument(doc: Document): Promise<void>;
  // ... tasks, notes, messages, users, notifications
}
```

The default `LocalStorageAdapter` comes pre-populated with a seed dataset and persists all modifications locally. It can be substituted with any relational or NoSQL database adapter (e.g., PostgreSQL, Firestore, SQLite) without touching UI components.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Global Command Palette & Search |
| <kbd>⌘</kbd> + <kbd>N</kbd> / <kbd>Ctrl</kbd> + <kbd>N</kbd> | Open Quick Capture (Note, Task, Doc, Message) |
| <kbd>ESC</kbd> | Close Modals, Command Palette & Drawers |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate search and command list items |
| <kbd>Enter</kbd> | Select or execute search action |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
* [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/koan-workspace.git
   cd koan-workspace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run TypeScript verification:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

* **Framework**: [React 19](https://react.dev/)
* **Language**: [TypeScript 5.8](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Build Tool**: [Vite 6](https://vitejs.dev/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Animations**: [Motion](https://motion.dev/)

---

## 📄 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

<div align="center">

# Brief 🩲

### private. temporary. no trace.

A two-person, ephemeral private chat app. No accounts. No history. Nothing sticks around.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

**[Live Demo](#-live-demo)** · **[Features](#-features)** · **[Tech Stack](#-tech-stack)** · **[Getting Started](#%EF%B8%8F-running-this-locally-for-development)** · **[Deployment](#-deploying-to-production-step-by-step)**

</div>

---

This repository is the **frontend** for Brief — the part people actually see and click on in their browser. It's built with **React** and **Vite**, styled with a dark "hacker/terminal" aesthetic, and talks to a separate backend server over the internet in real time using Socket.io.

Every chat room automatically self-destructs — along with all its messages — after 1 hour, or whenever the room's creator chooses to end it early. There's no sign-up, no login, no profile. You get a random alias, a private room code, and a countdown clock. That's it.

> Looking for the backend? See the **brief-server** repo — it handles rooms, messages, real-time events, and the database.

---

## 🔗 Live Demo

|                      |                                                      |
| -------------------- | ---------------------------------------------------- |
| **Live app**         | _https://brief-app-two.vercel.app/_                  |
| **Backend repo**     | _https://github.com/tycoonmigs/brief-app-server.git_ |
| **Backend live URL** | _https://brief-app-server.onrender.com/_             |

> ⚠️ **Heads up:** the backend runs on Render's free tier, which "falls asleep" after 15 minutes of no activity. If nobody's used the app in a while, the **first** person to open it might see a 30–50 second delay before anything responds. This isn't a bug — it's a known limitation of free hosting. It speeds right back up after that first request.

---

## ✨ Features

### Privacy & Ephemerality

- No accounts, no sign-up, no login — ever
- Random, anonymous alias generated per session (e.g. `SilentFox82`)
- Rooms self-destruct automatically after 1 hour — messages included
- Rooms left empty (both people gone) clean themselves up within ~30 seconds instead of waiting the full hour
- Room's creator can manually end the chat instantly for both people, at any time, via a private token only they hold
- Strict 2-person cap per room — a 3rd person trying to join gets a clear "room's full" message instead of quietly failing

### Chat Experience

- Real-time messaging, typing indicators, and live online/offline connection status
- Send images (inline preview) and files — PDFs, Word docs, spreadsheets, text files, zip archives
- React to any message with any emoji — hover (desktop) or long-press (mobile) for a Messenger-style quick-reaction popover
- Read receipts ("seen") so you know your message was actually read
- Emoji picker built directly into the message input
- Live countdown showing exactly when the current room will expire
- Copy-to-clipboard button for quickly sharing the room code
- Optional notification sound (toggle on/off in settings), synthesized in-browser — no audio file to load
- Auto-scroll to the latest message, with a sticky header/input so you're never fighting the page to read or type

### Onboarding & UX

- Short, skippable first-time walkthrough (never shows again once completed or skipped)
- Fully responsive — phone, tablet, and desktop
- Dark, terminal/hacker-styled interface: monospace fonts, scanline overlay, glow effects, subtle screen flicker
- Fake terminal "window" chrome around the landing page for extra atmosphere

### Security (client-side)

- Images can't be casually saved via right-click or drag — a deterrent, not a guarantee (see Security Notes below)
- All rendered text is escaped by React by default, and further sanitized server-side

---

## 🧱 Tech Stack

| Layer                   | Technology                                        | Why                                                                    |
| ----------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| UI Framework            | **React 18**                                      | Component-based UI, fast iteration                                     |
| Build Tool              | **Vite**                                          | Near-instant dev server, fast production builds                        |
| Real-time Communication | **Socket.io Client**                              | Bidirectional real-time events (messages, typing, presence, reactions) |
| Styling                 | **Plain CSS** (custom properties / CSS variables) | No framework overhead; full control over the custom terminal theme     |
| Fonts                   | **JetBrains Mono** (Google Fonts)                 | Code-friendly monospace font that fits the hacker aesthetic            |
| State Management        | **React Context + Hooks**                         | Lightweight — no external state library needed for this app's scope    |
| Hosting                 | **Vercel**                                        | Zero-config Vite deployments, generous free tier                       |

---

## 🗂️ Project Structure — What Each Part Does

This section explains **what each folder and file is for**, not what the code inside it does line-by-line (the code itself has comments explaining that). Think of this as a map of the building, not a tour of every room.

```
brief-privatemessagingapp/
├── public/                        → static files served as-is (e.g. favicon)
├── src/
│   ├── assets/                    → images/icons used inside the app
│   │
│   ├── components/                → reusable pieces of UI, each one focused on a single job
│   │   ├── ChatRoom.jsx             the main chat screen — messages, input box, header, everything live
│   │   ├── MessageBubble.jsx        a single message (text, image, or file), plus its reactions
│   │   ├── TypingIndicator.jsx      the "so-and-so is typing..." line
│   │   ├── Countdown.jsx            the live "expires in HH:MM:SS" timer
│   │   ├── RoomExpired.jsx          the screen shown once a room's time runs out
│   │   ├── CopyLinkButton.jsx       the "copy code" button in the chat header
│   │   ├── Footer.jsx               the credits footer (name + links), shown on every screen
│   │   ├── BuyMeCoffee.jsx          the "buy me a coffee" support link
│   │   ├── TerminalFrame.jsx        the fake terminal "window" look wrapped around the landing page
│   │   ├── ConnectionStatus.jsx     the green/red "connected" dot in the chat header
│   │   ├── SettingsPanel.jsx        the ⚙ settings popup (currently: notification sound on/off)
│   │   └── EmojiPicker.jsx          the emoji grid used for both typing and reacting
│   │
│   ├── pages/                     → full "screens" the app can show, made up of components above
│   │   ├── Landing.jsx              the homepage — create or join a room
│   │   └── ChatRoomPage.jsx         handles actually joining a room (or showing an error/full screen)
│   │                                 before handing off to ChatRoom.jsx
│   │
│   ├── context/                   → shared app-wide data, accessible from any component
│   │   └── SocketContext.jsx        creates ONE real-time connection to the server and shares it
│   │                                 everywhere, so we're not opening a new connection per component
│   │
│   ├── hooks/                     → small reusable pieces of logic (not visual, just behavior)
│   │   ├── useSocket.js             convenience shortcut to access the shared socket connection
│   │   └── useCountdown.js          the ticking-clock logic behind the Countdown component
│   │
│   ├── onboarding/                → the first-time user walkthrough
│   │   ├── Onboarding.jsx           the actual step-by-step tutorial overlay
│   │   └── onboardingSteps.js       just the text content for each tutorial step
│   │
│   ├── styles/                    → all CSS, split by what it styles
│   │   ├── theme.css                colors, fonts, and other reusable design "variables"
│   │   ├── global.css               base styles that apply everywhere (buttons, inputs, body, footer)
│   │   ├── animations.css           all animation keyframes (fades, glows, flicker, scanlines)
│   │   ├── landing.css              styles specific to the homepage
│   │   ├── chatroom.css             styles specific to the chat screen, reactions, settings, etc.
│   │   └── onboarding.css           styles specific to the tutorial overlay
│   │
│   ├── utils/                     → small standalone helper functions, no UI
│   │   ├── generateClipboardHelper.js   handles the actual "copy to clipboard" action
│   │   ├── notificationSound.js         plays the message-received sound + remembers on/off setting
│   │   └── emojiList.js                 the shared list of emojis used across the app
│   │
│   ├── App.jsx                    → the top-level component; decides whether to show onboarding,
│   │                                  the landing page, or an active chat room
│   ├── main.jsx                   → the actual entry point — this is what starts the whole app
│   └── index.css / App.css        → leftover default Vite files (largely unused once styles/ took over)
│
├── index.html                     → the single HTML page the whole app lives inside
├── .env                           → local secret/config values (NEVER committed to GitHub — see below)
├── .gitignore                     → tells Git which files to never track (node_modules, .env, etc.)
├── package.json                   → lists the project's dependencies and scripts
└── vite.config.js                 → configuration for Vite, the tool that runs/builds this project
```

---

## 🖥️ Running This Locally (For Development)

You don't need to be an experienced coder to follow these steps — just go one at a time.

### 1. Install the tools you need

- **Node.js** — download and install from [nodejs.org](https://nodejs.org) (choose the "LTS" version)
- A code editor like **VS Code** (optional, but makes editing files much easier)

### 2. Download this project

If you already have the folder, skip this. Otherwise:

```bash
git clone <your-repo-url>
cd brief-privatemessagingapp
```

### 3. Install the project's dependencies

This downloads all the code libraries the project depends on (React, Socket.io client, etc.):

```bash
npm install
```

### 4. Create your local `.env` file

In the project's root folder (same level as `package.json`), create a file named exactly `.env` and add this line:

```
VITE_SOCKET_URL=http://localhost:5000
```

This tells the frontend where to find the backend server. `http://localhost:5000` assumes you're also running `brief-server` locally on your own computer at the same time — see that project's README for how to start it.

### 5. Start the app

```bash
npm run dev
```

This will print a local address, usually `http://localhost:5173` — open that in your browser.

---

## 🚀 Deploying to Production (Step by Step)

This app is designed to be deployed with the frontend on **Vercel** and the backend on **Render** (see `brief-server`'s README for the backend half). Deploy the backend **first**, since the frontend needs to know its live web address.

### 1. Push this project to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

> Before running `git add .`, always run `git status` first and check that `.env` is **not** listed. If it is, stop — do not commit — and double check your `.gitignore` file includes a line that just says `.env`.

### 2. Create a Vercel account & import this project

1. Go to [vercel.com](https://vercel.com) and sign up (GitHub sign-in is easiest)
2. Click **Add New → Project**
3. Import this repo from GitHub — Vercel will auto-detect it as a Vite project

### 3. Add the environment variable

Before clicking Deploy, add this environment variable in Vercel's setup screen:

| Key               | Value                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `VITE_SOCKET_URL` | your live backend URL from Render, e.g. `https://your-backend.onrender.com` (no trailing slash) |

Leave "Sensitive" turned **off** for this one — it's just a public web address, not a secret.

### 4. Deploy

Click **Deploy**. Vercel will give you a live URL like `https://your-app.vercel.app`.

### 5. Update the backend to allow this new URL

Go back to your Render dashboard (backend project) and update its `CLIENT_URL` environment variable to match this exact new Vercel URL — this step is required for the two halves to be allowed to talk to each other (a security feature called CORS). See `brief-server`'s README for details.

### 6. Test it

Open your live Vercel URL, create a room, and try chatting from a second device or browser tab.

---

## 🔐 Security Notes

- The `.env` file is git-ignored and should never be committed — see below
- Room codes and the private "creator" token are generated using cryptographically secure randomness on the backend, not `Math.random()`
- Image "download protection" (blocked right-click/drag) is a UX deterrent only — it raises the casual-effort bar but cannot make an image truly unsavable once it's rendered in a browser (screenshots, dev tools, etc. always remain possible)
- All real security enforcement (file type/size validation, input sanitization, rate limiting, room-capacity limits) happens **server-side** — see `brief-server`'s README for the full breakdown

---

## 🗺️ Roadmap / Possible Future Additions

- [ ] Video sharing (likely via Cloudinary or similar, given free-tier server payload limits)
- [ ] Voice messages
- [ ] QR code room joining
- [ ] Message edit/delete within a short window
- [ ] End-to-end encryption

---

## 🔐 A Note on the `.env` File

The `.env` file holds configuration that's specific to where the app is running (like a web address) — it should **never** be uploaded to GitHub. This project's `.gitignore` file is already set up to block it automatically, but always double-check with `git status` before committing, just in case.

---

## 🙋 Frequently Asked (Non-Coder) Questions

**Q: I changed something and nothing happened.**
A: If you edited `.env`, you need to fully stop (Ctrl+C) and restart `npm run dev` — Vite only reads that file once, when it starts.

**Q: The site says "Failed to fetch" or shows connection errors.**
A: This almost always means the backend server (`brief-server`) either isn't running, or `VITE_SOCKET_URL` doesn't match its actual address. Double-check both.

**Q: Can I change the room duration (currently 1 hour)?**
A: Yes, but that setting lives in the **backend** repo, not this one — see `brief-server`'s README.

**Q: Why does the site take forever to load sometimes?**
A: That's the Render free-tier "cold start" delay mentioned above — the backend server needs a moment to wake up after being idle. It's normal, not a bug.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Credits

Built by **tycoonmigs**

- Portfolio: [tycooncv.vercel.app](https://tycooncv.vercel.app/)
- GitHub: [github.com/tycoonmigs](https://github.com/tycoonmigs)

If you found this useful or fun to poke around, feel free to [buy me a coffee ☕](https://buymeacoffee.com/tycoonmigs).

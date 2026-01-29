# 🤖 Project Context: Retro Portfolio (Windows 95 Theme)

This document serves as the absolute source of truth for AI agents interacting with this codebase. It contains exhaustive technical details.

## 1. Project Identity & Purpose
-   **Name**: Jay Dixit - Retro Personal Portfolio
-   **Visual Theme**: Windows 95 aesthetic (teal background, gray windows, bevels) enhanced with modern glassmorphism (backdrop-filter), CSS animations, and responsivity.
-   **Core Functionality**: Displays portfolio content (Skills, Projects), provides playable games (Snake, Tic-Tac-Toe), and features an AI Chat Assistant powered by Google Gemini Pro (via proxy).
-   **Platform**: Web (HTML/CSS/JS), Node.js Backend.

## 2. Technology Stack & Dependencies

### Frontend (Vanilla)
-   **HTML5**: Semantic structure using `<section>` as "Windows".
-   **CSS3**:
    -   **No Frameworks**: Pure CSS.
    -   **Variables**: Heavily used for theming (`--win-teal`, `--win-gray`, etc.).
    -   **Glassmorphism**: `backdrop-filter: blur(10px)` on `.window-body`.
    -   **Animations**: Custom `@keyframes` (fadeIn, slideIn, bounce, shake, glitch, typing).
    -   **Responsive**: Media queries at `768px` and `480px`.
-   **JavaScript**:
    -   **ES6 Modules**: No bundle step (served raw).
    -   **DOM API**: Extensive manipulation (`document.createElement`, `classList`, `addEventListener`).
    -   **Canvas 2D**: Used for the Snake game.
    -   **Fetch API**: For backend communication (`/chat`).

### Backend (Node.js)
-   **Runtime**: Node.js.
-   **Framework**: Express.js (`^5.2.1`).
-   **Dependencies**:
    -   `cors` (`^2.8.6`): Cross-Origin Resource Sharing.
    -   `dotenv` (`^17.2.3`): Environment variable management.
-   **API Integration**: Google Gemini Pro (REST API).

### Assets
-   **Icons**: FontAwesome 6.0.0 (CDN).
-   **Images**: SVGs/PNGs in `images/` folder + external placeholders.
-   **Fonts**: 'VT323' (Google Fonts) for pixel art style, 'MS Sans Serif' fallback.

## 3. Detailed Architecture

### 3.1 Backend (`server.js`)
-   **Port**: Defaults to `3000` or `process.env.PORT`.
-   **Middleware**: JSON body parser, CORS, Static file serving (`./`).
-   **Route `POST /chat`**:
    1.  Receives JSON: `{ message: "User question" }`.
    2.  Validates `process.env.GEMINI_API_KEY`.
    3.  Constructs Prompt: Includes context about Jay (Skills, Projects, Background).
    4.  Calls Gemini API: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`.
    5.  Returns JSON: `{ candidates: [ { content: { parts: [ { text: "..." } ] } } ] }`.

### 3.2 Frontend Structure (`index.html`)

#### DOM Hierarchy (Key Elements)
-   `body`
    -   `#splash-screen`: "DIXIT BIOS" boot sequence overlay.
    -   `.desktop-icons`: Fixed navigation bar (left side on desktop, top on mobile).
        -   Links to `#home`, `#projects`, `#skills`, `#games`, `#contact`.
        -   Resume download link.
    -   `main.container`
        -   `section#home.window`: Profile card, intro text.
        -   `section#projects.window`: CSS Grid of `.project-card`.
        -   `section#skills.window`: Fieldsets with `.skill-tag`.
        -   `section#games.window`: Holds Snake (`canvas`) and Tic-Tac-Toe (`.ttt-board`).
        -   `section#contact.window`: Form pointing to Web3Forms API.
    -   `.taskbar`: Bottom fixed bar.
        -   `.start-button`
        -   `#taskbar-clock`
        -   `#theme-toggle`: Moon/Sun icon.
    -   `#ai-assistant`: Chat widget (movable).
    -   `#assistant-toggle`: Floating robot button (bottom right).

## 4. Logic Deep Dive (`script.js`)

### 4.1 Initialization
-   **Splash Screen**: Simulates boot text, random progress bar updates, fades out after completion.
-   **Clock**: Updates `#taskbar-clock` every 1000ms.
-   **Scroll Observer**: Adds `.visible` class to `.scroll-animate` elements (IntersectionObserver).

### 4.2 AI Assistant System
-   **Hybrid Response Engine**:
    1.  **Local Match**: Checks `knowledgeBase` object (e.g., checks if message contains "skills", "projects", "contact"). Returns instant canned response.
    2.  **Greetings/Thanks**: Regex matching for common social phrases.
    3.  **Server Fallback**: If no local match, `fetch('/chat')`.
-   **UI Logic**:
    -   `sendMessage()`: Handles input, typing indicator, and scrolling.
    -   **Draggable**: Custom drag-and-drop logic for `.assistant-header` (mouse events).

### 4.3 Games Engine

#### Snake Game
-   **Canvas**: `<canvas id="snake-canvas">`.
-   **State**: `snake` array of objects `{x, y}`, `food` object, `score`, `direction`.
-   **Loop**: `setInterval(draw, 200)`.
-   **Collision**: Checks wall boundaries (0 to width/height) and self-intersection.

#### Tic-Tac-Toe
-   **DOM Based**: 3x3 Grid of divs.
-   **State**: `boardState` (Array size 9), `currentPlayer` ('X' or 'O').
-   **AI Opponent (Minimax-Lite)**:
    1.  **Win**: Check if AI has 2 in a row.
    2.  **Block**: Check if Player has 2 in a row.
    3.  **Strategic**: Take Center (index 4).
    4.  **Strategic**: Take Corners.
    5.  **Random**: Take any empty slot.

### 4.4 Visual Effects
-   **Theme Toggle**: Toggles `body.dark-mode`. Triggers `createParticles()` (canvas-less particle explosion).
-   **Typer Effect**: `typeWriter()` function for the "Hi, I'm Jay Dixit" header.
-   **Parallax**: Desktop icons move slightly based on mouse position.
-   **3D Tilt**: `.project-card` rotates based on mouse hover position (CSS transform perspective).
-   **Konami Code**: Listens for Up,Up,Down,Down... triggers Rainbow animation on body.
-   **Click Ripples**: Spawns a `.ripple` span on button clicks for Material-like effect.

## 5. Design System Details (`style.css`)

### 5.1 CSS Variables
| Variable | Value (Light) | Role |
| :--- | :--- | :--- |
| `--win-teal` | `#008080` | Background |
| `--win-gray` | `#c0c0c0` | Window Face |
| `--win-gray-dark` | `#808080` | Shadow / Border |
| `--win-white` | `#ffffff` | Highlight / Border |
| `--win-blue-dark` | `#000080` | Title Bars |
| `--win-blue-light` | `#1084d0` | Title Gradients |

### 5.2 Key Classes
-   `.window`: The main container. Uses complex borders to simulate 3D relief: `border-color: white dark dark white`.
-   `.window-title-bar`: Gradient background header.
-   `.window-button`: Box with inset text for Minimize/Close.
-   `.desktop-icon`: Flex column behavior, pixelated image rendering.

### 5.3 Dark Mode Overrides
-   Activates via `body.dark-mode`.
-   Changes `--win-teal` to `#1a1a1a`.
-   Changes window backgrounds to dark gray `#4a4a4a`.
-   Adjusts text colors to light gray `#e0e0e0`.

## 6. Deployment Guide (Render)
1.  **Build Command**: `npm install`
2.  **Start Command**: `node server.js`
3.  **Environment Variables**:
    -   `GEMINI_API_KEY`: Required.
    -   `PORT`: Optional (Render sets this auto).

## 7. Future AI instructions
-   **When adding projects**: Update `index.html` (copy `.project-card`) AND `script.js` (`knowledgeBase.projects`).
-   **When modifying style**: Always use CSS variables. Respect the retro aesthetic.
-   **Refactoring**: Keep `script.js` functions modular. Do not switch to a framework (React/Vue) unless explicitly requested; the unique value is the Vanilla implementation.

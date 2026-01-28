# 🎮 Jay Dixit - Retro Personal Portfolio

A unique, premium retro-themed personal portfolio website inspired by the classic **Windows 95** operating system, supercharged with modern AI and a secure backend.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://portfolio-eip0.onrender.com)

## 🎨 New Premium UI Features
- **BIOS Splash Screen**: A retro-style boot sequence (DIXIT BIOS) that greets visitors on arrival.
- **Glassmorphism Design**: Modern translucent window bodies with backdrop blur effects, blending 90s nostalgia with modern aesthetics.
- **Dark Mode Support**: A system-wide dark theme toggle, now integrated into the taskbar "tray."
- **Responsive Layout**: Optimized for mobile, with a dynamic desktop-to-mobile transformation.

## 🤖 Smart Features
- **AI Assistant (Gemini Pro)**: A built-in chat assistant that knows Jay's skills and projects. It uses the Google Gemini API to provide intelligent, conversational responses.
- **Smart Game AI**: Upgraded Tic-Tac-Toe AI that actually competes to win or block your moves, and a classic Snake game.

## 🛠️ Modern Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+).
- **Backend (Secure)**: Node.js & Express.js server acting as a secure proxy for API calls.
- **Security**: Environment variables (`.env`) used to protect sensitive API keys.
- **AI**: Google Generative AI (Gemini Pro).

## 📂 Project Structure
```
/Portfolio-main
│
├── index.html        # Main entry point & UI structure
├── style.css         # Modernized Design System & Glassmorphism
├── script.js         # Core logic, Games, and Frontend-Backend bridge
├── server.js         # Node.js backend proxy
├── .env              # Sensitive Keys (Git-ignored)
├── pdfs/             # CV/Resume storage
├── images/           # SVGs and Pixel-art assets
└── package.json      # Dependencies (Express, Dotenv, Cors)
```

## 🚀 Deployment (Render)
This project is optimized for deployment on **Render** (Web Service):
1.  Connect to GitHub.
2.  Set Build Command: `npm install`
3.  Set Start Command: `node server.js`
4.  Add Environment Variable: `GEMINI_API_KEY`

---
*Created with ❤️ by Jay Dixit*

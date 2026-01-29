// Script.js for Interactivity
console.log("Welcome to Jay Dixit's");


/* --- Games Logic --- */

// Snake Game Variables
const canvas = document.getElementById('snake-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const box = 10;
let snake = [];
let food = {};
let score = 0;
let d;
let game;
let gameRunning = false;

// Tic-Tac-Toe Variables
const tttBoard = document.getElementById('ttt-board');
const tttStatus = document.getElementById('ttt-status');
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let tttGameActive = true;


// Initialize Games if elements exist
document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    updateClock();
    setInterval(updateClock, 1000);

    if (document.getElementById('snake-canvas')) {
        initSnake();
        initTTT();
    }
});

/* --- Splash Screen Logic --- */
function initSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const progress = document.getElementById('boot-progress');
    const status = document.getElementById('boot-status');

    if (!splash) return;

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            status.innerText = "System Ready. Booting...";
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => splash.remove(), 800);
            }, 500);
        } else {
            width += Math.random() * 15;
            if (width > 100) width = 100;
            progress.style.width = width + '%';

            if (width > 40) status.innerText = "Loading Kernel...";
            if (width > 70) status.innerText = "Starting UI Shell...";
        }
    }, 150);
}

/* --- Snake Game Functions --- */
function initSnake() {
    document.getElementById('start-snake').addEventListener('click', startSnakeGame);
    document.addEventListener('keydown', direction);
}

function startSnakeGame() {
    if (gameRunning) clearInterval(game);
    snake = [];
    snake[0] = { x: 15 * box, y: 15 * box };
    score = 0;
    d = undefined; // Reset direction
    document.getElementById('snake-score').innerText = score;
    spawnFood();
    gameRunning = true;
    // Decreased speed: 200ms instead of 100ms
    game = setInterval(draw, 200);
}

function direction(event) {
    let key = event.keyCode;
    // Prevent scrolling for arrow keys
    if ([37, 38, 39, 40].includes(key)) {
        event.preventDefault();
    }

    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = "#000"; // Clear canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#00FF00" : "#FFFFFF"; // Green Head, White Body
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Eat Food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        document.getElementById('snake-score').innerText = score;
        spawnFood();
    } else {
        snake.pop(); // Remove tail
    }

    // Game Over Conditions
    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameRunning = false;
        alert('Game Over! Score: ' + score);
    }

    snake.unshift(newHead);
}


/* --- Tic-Tac-Toe Functions --- */
function initTTT() {
    createBoard();
    document.getElementById('reset-ttt').addEventListener('click', resetTTT);
}

function createBoard() {
    tttBoard.innerHTML = '';
    boardState.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('ttt-cell');
        cellDiv.dataset.index = index;
        cellDiv.innerText = cell;
        cellDiv.addEventListener('click', handleCellClick);
        if (cell !== '') cellDiv.classList.add('taken');
        tttBoard.appendChild(cellDiv);
    });
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (boardState[index] !== '' || !tttGameActive || currentPlayer === 'O') return;

    makeMove(index, 'X');
    if (tttGameActive) {
        setTimeout(computerMove, 500); // Small delay for "thinking"
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    createBoard(); // Re-render to show update (simple way)
    checkResult();
    if (tttGameActive) {
        currentPlayer = player === 'X' ? 'O' : 'X';
        tttStatus.innerText = currentPlayer === 'X' ? "Your Turn (X)" : "Computer's Turn (O)";
    }
}

function computerMove() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Helper function to see if a player is one move away from winning
    const getBestMove = (player) => {
        for (let combo of wins) {
            const [a, b, c] = combo;
            const vals = [boardState[a], boardState[b], boardState[c]];
            if (vals.filter(v => v === player).length === 2 && vals.filter(v => v === '').length === 1) {
                return combo[vals.indexOf('')];
            }
        }
        return null;
    };

    // 1. Check if AI can win
    let move = getBestMove('O');

    // 2. Check if AI needs to block player
    if (move === null) {
        move = getBestMove('X');
    }

    // 3. Take center if available
    if (move === null && boardState[4] === '') {
        move = 4;
    }

    // 4. Take corners if available
    if (move === null) {
        const corners = [0, 2, 6, 8].filter(idx => boardState[idx] === '');
        if (corners.length > 0) {
            move = corners[Math.floor(Math.random() * corners.length)];
        }
    }

    // 5. Fallback to any available spot
    if (move === null) {
        let available = boardState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        if (available.length > 0) {
            move = available[Math.floor(Math.random() * available.length)];
        }
    }

    if (move !== null) {
        makeMove(move, 'O');
    }
}

function checkResult() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let roundWon = false;
    for (let i = 0; i < wins.length; i++) {
        const [a, b, c] = wins[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        tttStatus.innerText = currentPlayer === 'X' ? "You Won!" : "Computer Won!";
        tttGameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        tttStatus.innerText = "Draw!";
        tttGameActive = false;
    }
}

function resetTTT() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    tttGameActive = true;
    currentPlayer = 'X';
    tttStatus.innerText = "Play against PC";
    createBoard();
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes} ${ampm}`;
    const clockElement = document.getElementById('taskbar-clock');
    if (clockElement) {
        clockElement.innerText = timeString;
    }
}

/* --- Theme Toggle Logic --- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Toggle Icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}

/* ========================================
   ANIMATION ENHANCEMENTS
   ======================================== */

/* --- Scroll-Triggered Animations --- */
// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with scroll-animate class
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach(el => observer.observe(el));
});

/* --- Smooth Scroll for Navigation Links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* --- Enhanced Button Click Effects --- */
document.querySelectorAll('button, .window-button').forEach(button => {
    button.addEventListener('click', function (e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

/* --- Window Shake Effect on Close Button --- */
document.querySelectorAll('.window-controls .window-button').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();
        const window = this.closest('.window');
        if (window && this.textContent.trim() === 'X') {
            window.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                window.style.animation = '';
            }, 500);
        }
    });
});

/* --- Desktop Icon Double-Click Effect --- */
document.querySelectorAll('.desktop-icon').forEach(icon => {
    let clickCount = 0;
    let clickTimer = null;

    icon.addEventListener('click', function (e) {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;

            // Add special animation on double-click
            this.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        }
    });
});

/* --- Typing Effect for Profile Name --- */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '3px solid var(--win-black)';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Blink cursor a few times then remove
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 2000);
        }
    }

    type();
}

// Apply typing effect to h1 on page load
window.addEventListener('load', () => {
    const profileH1 = document.querySelector('.profile-info h1');
    if (profileH1) {
        const originalText = profileH1.textContent;
        // Remove CSS animation and use JS instead for better control
        profileH1.style.animation = 'none';
        setTimeout(() => {
            typeWriter(profileH1, originalText, 100);
        }, 500);
    }
});

/* --- Optimized Parallax Effect for Desktop Icons --- */
let mouseX = 0;
let mouseY = 0;
let parallaxTicking = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
});

function updateParallax() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach((icon, index) => {
        const speed = (index + 1) * 2;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });
}

/* --- Project Card Tilt Effect --- */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

/* --- Skill Tag Click Animation --- */
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function () {
        this.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
});

/* --- Add Particle Effect on Theme Toggle --- */
function createParticles(x, y, color) {
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = x;
        let posY = y;
        let opacity = 1;

        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;

            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

// Add particle effect to theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const color = document.body.classList.contains('dark-mode') ? '#FFD700' : '#4169E1';
        createParticles(x, y, color);
    });
}

/* --- Konami Code Easter Egg --- */
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);

    if (konamiCode.join('').includes(konamiSequence.join(''))) {
        // Easter egg: Make everything rainbow!
        document.body.style.animation = 'rainbow 5s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

/* --- Add CSS for ripple effect dynamically --- */
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

/* --- Console Easter Egg --- */
console.log('%c🎮 Welcome to Jay Dixit\'s Portfolio! 🎮', 'font-size: 20px; font-weight: bold; color: #1084d0;');
console.log('%c🤖 AI Assistant loaded! Click the robot icon to chat.');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 14px; color: #008080;');
console.log('%cBuilt with retro vibes and modern tech! 💾', 'font-size: 12px; font-style: italic;');

/* ========================================
   AI ASSISTANT FUNCTIONALITY
   ======================================== */

// Knowledge base about Jay
const knowledgeBase = {
    skills: {
        keywords: ['skill', 'skills', 'technology', 'tech', 'know', 'programming', 'language', 'code', 'coding'],
        response: "Jay knows Python, Java, C, SQL, and HTML. He works with frameworks like React, Django, Matplotlib, NumPy, and Seaborn. He's also proficient with Git/GitHub, Figma, Docker, Android Studio, and VS Code. 💻"
    },
    projects: {
        keywords: ['project', 'projects', 'built', 'created', 'work', 'portfolio', 'app', 'application'],
        response: "Jay has built several impressive projects:\n\n📊 **Telco Churn Risk** - A churn prediction model with interactive dashboard that estimates customer churn probability.\n\n📱 **EduLab App** - Full-stack Android app with Jitsi Meet & JDoodle APIs, featuring an AI chatbot for instant programming assistance.\n\nPlus more ongoing projects! Check out the Projects section above to learn more."
    },
    experience: {
        keywords: ['experience', 'background', 'about', 'who', 'jay', 'dixit'],
        response: "Jay Dixit is pursuing a progressive career in software development. He builds full-stack apps, analyzes data, and solves problems with code. His motto is: 'Enhancing knowledge through continuous learning and innovation.' 🚀"
    },
    contact: {
        keywords: ['contact', 'email', 'reach', 'hire', 'connect', 'message', 'talk'],
        response: "You can contact Jay through the contact form on this portfolio! Just scroll down to the 'Contact Me' section or click the envelope icon on the left. He'd love to hear from you! 📧"
    },
    education: {
        keywords: ['education', 'study', 'degree', 'university', 'college', 'school', 'learn'],
        response: "Jay is currently pursuing his education while building practical projects and gaining hands-on experience in software development. He believes in learning by doing! 🎓"
    },
    games: {
        keywords: ['game', 'games', 'play', 'fun', 'snake', 'tic-tac-toe'],
        response: "Jay built some fun retro games right into this portfolio! You can play Snake and Tic-Tac-Toe in the Games section. Try them out! 🎮"
    },
    github: {
        keywords: ['github', 'git', 'repository', 'repo', 'code'],
        response: "You can check out Jay's GitHub profile at github.com/Jaydixit05 to see his code and contributions! Click the GitHub icon on the left to visit. 🐙"
    }
};

// AI Assistant Elements
const assistantToggle = document.getElementById('assistant-toggle');
const aiAssistant = document.getElementById('ai-assistant');
const minimizeBtn = document.getElementById('minimize-assistant');
const closeBtn = document.getElementById('close-assistant');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

// Toggle assistant visibility
if (assistantToggle) {
    assistantToggle.addEventListener('click', () => {
        aiAssistant.classList.toggle('active');
        if (aiAssistant.classList.contains('active')) {
            chatInput.focus();
            // Remove minimized state when opening
            aiAssistant.classList.remove('minimized');
        }
    });
}

// Minimize assistant
if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
        aiAssistant.classList.toggle('minimized');
    });
}

// Close assistant
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        aiAssistant.classList.remove('active');
    });
}

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    typingIndicator.style.display = 'flex';

    try {
        // Get AI response (now properly awaited)
        const response = await getAIResponse(message);
        typingIndicator.style.display = 'none';
        addMessage(response, 'bot');
    } catch (error) {
        typingIndicator.style.display = 'none';
        addMessage("Sorry, I encountered an error. Please try again! 🔧", 'bot');
        console.error('Send message error:', error);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const prefix = sender === 'user' ? '👤 You:' : '🤖 Assistant:';

    // Convert newlines to <br> for better formatting
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = `<strong>${prefix}</strong> ${formattedText}`;

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom smoothly
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// Get AI response based on keywords or use Gemini API
async function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check knowledge base first for instant responses
    for (const [category, data] of Object.entries(knowledgeBase)) {
        if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return data.response;
        }
    }

    // Greetings - instant response
    if (lowerMessage.match(/\b(hi|hello|hey|greetings|sup|yo)\b/)) {
        const greetings = [
            "Hello! 👋 I'm here to help you learn about Jay. You can ask me about his skills, projects, experience, or how to contact him!",
            "Hey there! 😊 Ask me anything about Jay's portfolio, skills, or projects!",
            "Hi! 🤖 I'm Jay's AI assistant. What would you like to know?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Thanks - instant response
    if (lowerMessage.match(/\b(thank|thanks|thx|ty)\b/)) {
        const thanks = [
            "You're welcome! Feel free to ask me anything else about Jay's portfolio! 😊",
            "Happy to help! Let me know if you have more questions! 🎉",
            "No problem! I'm here if you need anything else! 💙"
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }

    // Help - instant response
    if (lowerMessage.match(/\b(help|what can you|capabilities)\b/)) {
        return "I can answer questions about:\n\n• Jay's skills and technologies\n• His projects and work\n• His background and experience\n• How to contact him\n• His education\n• The games on this portfolio\n\nJust ask me anything! 🤔";
    }

    // Use our backend proxy for AI responses (keeps API key secure)
    try {
        const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/chat'
            : '/chat'; // Relative path works if frontend and backend are on same domain

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            console.error('Backend Error:', data.error);
            return "I'm having trouble connecting to my AI brain right now. Try asking about Jay's skills, projects, or experience! 🤔";
        } else {
            return "I'm not sure about that. Ask me about Jay's skills, projects, or how to contact him! 💡";
        }
    } catch (error) {
        console.error('AI Error:', error);
        return "I'm having trouble connecting right now. Try asking about Jay's skills, projects, or experience! 🔧";
    }
}

// Event listeners
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Make assistant draggable (bonus feature!)
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;

const assistantHeader = document.querySelector('.assistant-header');

if (assistantHeader) {
    assistantHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function dragStart(e) {
    // Don't drag if clicking buttons
    if (e.target.classList.contains('assistant-button')) return;

    initialX = e.clientX - aiAssistant.offsetLeft;
    initialY = e.clientY - aiAssistant.offsetTop;
    isDragging = true;
    assistantHeader.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    // Keep window within viewport
    const maxX = window.innerWidth - aiAssistant.offsetWidth;
    const maxY = window.innerHeight - aiAssistant.offsetHeight;

    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));

    aiAssistant.style.left = currentX + 'px';
    aiAssistant.style.top = currentY + 'px';
    aiAssistant.style.right = 'auto';
    aiAssistant.style.bottom = 'auto';
}

function dragEnd() {
    isDragging = false;
    if (assistantHeader) {
        assistantHeader.style.cursor = 'move';
    }
}

// Add welcome animation to assistant toggle
setTimeout(() => {
    if (assistantToggle) {
        assistantToggle.style.animation = 'bounce 1s ease';
        setTimeout(() => {
            assistantToggle.style.animation = 'pulse 2s ease-in-out infinite';
        }, 1000);
    }
}, 3000);

console.log('🤖 AI Assistant ready! Click the robot button to start chatting.');

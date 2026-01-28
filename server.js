const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, Images)
app.use(express.static('./'));

// Proxy endpoint for Gemini AI
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key not configured' });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an AI assistant for Jay Dixit's portfolio website. Answer the following question in a friendly, brief way (2-3 sentences max).

Context about Jay Dixit:
- Skills: Python, Java, C, SQL, HTML, React, Django, Matplotlib, NumPy, Seaborn, Git/GitHub, Figma, Docker, Android Studio, VS Code
- Projects: 
  1. Telco Churn Risk - ML churn prediction model with interactive dashboard
  2. EduLab App - Full-stack Android app with Jitsi Meet & JDoodle APIs, featuring AI chatbot
- Background: Software developer pursuing progressive career, builds full-stack apps, analyzes data
- Motto: "Enhancing knowledge through continuous learning and innovation"
- GitHub: github.com/Jaydixit05
- Contact: Available through portfolio contact form

Question: ${message}

Keep your response conversational, helpful, and under 3 sentences. Use emojis sparingly.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150
                    }
                })
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to fetch AI response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

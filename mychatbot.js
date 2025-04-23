const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

//const OPENAI_API_KEY = "```";// add api key 

app.use(bodyParser.json());

// ===== User Model & Logic =====
class User {
    constructor(id, name, age, gender, isStudent) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.isStudent = isStudent;
        this.searchHistory = [];
    }

    addSearch(city) {
        this.searchHistory.push(city);
    }
}

const users = [];

// Sample destinations
// change these asap after discussing tom

const destinations = {
    student: ['Manali', 'Goa', 'Rishikesh'],
    youngWomen: ['Bali', 'Tokyo', 'Paris'],
    older: ['Switzerland', 'New Zealand'],
    general: ['Dubai', 'Singapore', 'London']
};

function recommendDestinations(user) {
    if (user.isStudent) return destinations.student;
    if (user.gender === 'female' && user.age < 25) return destinations.youngWomen;
    if (user.age > 30) return destinations.older;
    return destinations.general;
}

// ===== API Routes =====
app.get('/', (req, res) => {
    res.send("\ud83c\udf0d Welcome to the Travel AI Chatbot!");
});

// Register a user
app.post('/register', (req, res) => {
    const { id, name, age, gender, isStudent } = req.body;

    if (!id || !name || age === undefined || !gender) {
        return res.status(400).json({ error: "Missing user details." });
    }

    const newUser = new User(id, name, age, gender, isStudent);
    users.push(newUser);
    res.json({ message: `User ${name} registered successfully.` });
});

// Chat with the bot
app.post('/chat', async (req, res) => {
    const { id, message } = req.body;

    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: "User not found. Please register first." });

    // Local keyword-based logic
    const lower = message.toLowerCase();
    if (lower.includes("recommend") || lower.includes("where should i go")) {
        const recs = recommendDestinations(user);
        return res.json({
            reply: `Based on your profile, here are some great destinations for you: ${recs.join(", ")}`
        });
    }

    // Optionally add searches
    if (lower.startsWith("i searched")) {
        const city = message.split("i searched")[1].trim();
        user.addSearch(city);
        return res.json({ reply: `Got it! Added \"${city}\" to your search history.` });
    }

    // Otherwise, use OpenAI for fallback
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful travel assistant who personalizes advice based on user age, gender, and student status." },
                { role: "user", content: `User info: age=${user.age}, gender=${user.gender}, isStudent=${user.isStudent}` },
                { role: "user", content: message }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const botReply = response.data.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\ud83d\ude80 Server running on port ${PORT}`);
});

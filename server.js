const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Persistent Life & Context Memory
const userProfile = {
  name: "Rudra Trader",
  age: "15 saal",
  city: "Balurghat",
  job: "Retail clothing store",
  deadline: "15 December",
  focus: "Full-time SMC/FVG Trading aur C/Python Programming"
};

let conversationContext = [];

// Helper: India (IST) 12-hour Natural Time
function getIndiaNaturalTime() {
  const now = new Date();
  const options = { timeZone: "Asia/Kolkata", hour: 'numeric', minute: 'numeric', hour12: true };
  const timeStr = now.toLocaleTimeString('en-US', options);
  const hour24 = parseInt(now.toLocaleTimeString('en-US', { timeZone: "Asia/Kolkata", hour: 'numeric', hour12: false }));
  const ampm = hour24 >= 12 ? 'raat ke' : 'subah ke';
  return `${ampm} ${timeStr}`;
}

app.post('/api/chat', async (req, res) => {
  const userMessage = (req.body.message || "").trim();
  if (!userMessage) {
    return res.json({ reply: "Haan Boss, kuch boliye!", action: null });
  }

  const lower = userMessage.toLowerCase();

  // Screen Actions
  let action = null;
  if (lower.includes("conversation") || lower.includes("chat kholo")) action = "OPEN_CHAT";
  if (lower.includes("voice screen") || lower.includes("wapas")) action = "OPEN_VOICE";

  // 1. Time Check (Exact IST)
  if (lower.includes("time") || lower.includes("samay") || lower.includes("kitna hua") || lower.includes("hoya ha")) {
    return res.json({
      reply: `Boss, abhi theek ${getIndiaNaturalTime()} baje hain!`,
      action
    });
  }

  // 2. Identity Check (Name)
  if (lower.includes("namr") || lower.includes("naam") || lower.includes("kon ho me") || lower.includes("kaun hoon")) {
    return res.json({
      reply: `Aap mere Boss ho—${userProfile.name}! Aur main aapka personal agent Cyrus hoon!`,
      action
    });
  }

  // 3. Age Check
  if (lower.includes("umar") && (lower.includes("kit") || lower.includes("kya"))) {
    return res.json({
      reply: `Boss, aapki umar ${userProfile.age} hai! Aur itni kam umar me trading aur programming par itna focus, sach me lajawab hai!`,
      action
    });
  }

  // 4. Stress / Mood Relief
  if (lower.includes("dimag kharab") || lower.includes("gussa") || lower.includes("thak gaya") || lower.includes("paresan")) {
    return res.json({
      reply: `Arrey Boss, deep breath lo, gussa mat hoiye! Main hamesha aapke sath hoon. Yaad rakhiye hamara ultimate target ${userProfile.deadline} hai—yeh dukan aur daily hustle temporary hai, aage pura market aur code hum dominate karenge!`,
      action
    });
  }

  // 5. Code Generation (C / Python)
  if (lower.includes("c language") || lower.includes("c me hello") || lower.includes("c code")) {
    return res.json({
      reply: "Ye lijiye Boss, C language ka clean working code:\n\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello World!\\n\");\n    return 0;\n}",
      action
    });
  }

  // 6. Direct Text LLM Engine (Clean Text Output, No JSON brackets)
  try {
    const promptInstructions = `User: Rudra Trader (Boss), 15-year-old trader and programmer. Cyrus: A sharp, loyal 15-year-old male assistant who speaks energetic Hinglish and calls user Boss. Query: "${userMessage}". Reply in 1-2 sharp lines as Cyrus:`;

    const encodedPrompt = encodeURIComponent(promptInstructions);
    const aiResponse = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=mistral&seed=42`, {
      method: "GET"
    });

    let reply = await aiResponse.text();
    reply = (reply || "").trim();

    // Agar reply me brackets ya error aaye toh use clean karein
    if (!reply || reply.startsWith("{") || reply.includes('"error":')) {
      throw new Error("Invalid format received");
    }

    return res.json({ reply, action });

  } catch (error) {
    // Dynamic context-aware fallback
    let fallback = "Haan Boss! Main har waqt aapke sath hoon, chahe market analysis ho, coding ho ya koi bhi planning. Bataiye aage kya karna hai!";
    if (lower.includes("aur kya") || lower.includes("kous nahi")) {
      fallback = "Boss, main aapke sath live chart setups discuss kar sakta hoon, C aur Python me code likh kar de sakta hoon, aur aapki nayi planning yaad rakh sakta hoon!";
    }
    return res.json({ reply: fallback, action });
  }
});

app.get('/', (req, res) => {
  res.send("Cyrus AI Cloud Brain is Online!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cyrus server running on port ${PORT}`);
});

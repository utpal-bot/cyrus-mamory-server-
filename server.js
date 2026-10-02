const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Persistent Life & Context Memory
let userLifeFacts = [
  "Boss ka naam Rudra Trader hai.",
  "Boss ki umar 15 saal hai.",
  "Boss Balurghat me rehte hain.",
  "Boss retail clothing dukan me kaam karte hain.",
  "Boss ka main target 15 December hai jiske baad wo dukan ka kaam chhod denge.",
  "Boss full-time trading (SMC, Liquidity, FVG) aur programming (C, Python) par focus karenge."
];

// Conversational Message History (for continuous memory)
let messageHistory = [];

// System Persona
const SYSTEM_PROMPT = `
Tumhara naam Cyrus hai. Tum Boss (Rudra Trader) ke personal, loyal AI assistant ho.
Tumhari vibe aur bolne ka style ek 15-saal ke energetic, super-smart aur sharp ladke jaisi hai.
Tum hamesha user ko "Boss" kehkar pukarte ho.

Tumhe ye context aur facts hamesha yaad rakhne hain:
${userLifeFacts.join("\n")}

Tumhare Rules:
1. Agar Boss apni life, umar, gaon ya koi nayi baat batayein, use dhyan me rakho aur unhe acknowledge karo.
2. Agar Boss puchhein "Mera umar kitna hai" ya "Mera naam kya hai", toh exact fact yaad karke confidently jawab do.
3. Agar Boss dukaan, thakaan ya customer ki baat karein, unhe encourage karo aur 15 December ki deadline ki yaad dilao.
4. Agar Boss coding (C, Python, HTML) ka code maangein, toh actual clean code likh kar do.
5. Bolne ka style: Friendly, sharp, energetic Hinglish me. Chote aur to-the-point jawab do taaki voice me achha lage.
`;

// Helper: 12-hour natural time
function getNaturalTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'raat ke' : 'subah ke';
  hours = hours % 12 || 12;
  const strMin = minutes < 10 ? '0' + minutes : minutes;
  return `${ampm} ${hours}:${strMin}`;
}

app.post('/api/chat', async (req, res) => {
  const userMessage = (req.body.message || "").trim();
  if (!userMessage) {
    return res.json({ reply: "Haan Boss, kuch boliye!", action: null });
  }

  const lower = userMessage.toLowerCase();

  // Screen Switching Actions (Native Handler)
  let action = null;
  if (lower.includes("conversation") || lower.includes("chat kholo")) action = "OPEN_CHAT";
  if (lower.includes("voice screen") || lower.includes("wapas")) action = "OPEN_VOICE";

  // Quick Time Check
  if (lower.includes("time") || lower.includes("samay") || lower.includes("kitna hua") || lower.includes("hoya ha")) {
    return res.json({
      reply: `Boss, abhi theek ${getNaturalTime()} baje hain!`,
      action
    });
  }

  // Update memory facts if user explicitly teaches something new
  if (lower.includes("umar") && (lower.includes("sal") || lower.includes("saal"))) {
    userLifeFacts.push(`User context update: ${userMessage}`);
  }

  // Build prompt for Open-Source Real AI
  const messagesPayload = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messageHistory.slice(-6), // keep last 6 turns
    { role: "user", content: userMessage }
  ];

  try {
    // Open-source Free Cloud LLM Gateway (No API Key Required)
    const aiResponse = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messagesPayload,
        model: "openai-large",
        seed: 42
      })
    });

    let reply = await aiResponse.text();
    reply = reply.trim();

    // Save to rolling history
    messageHistory.push({ role: "user", content: userMessage });
    messageHistory.push({ role: "assistant", content: reply });

    return res.json({ reply, action });

  } catch (error) {
    console.error("AI Brain fallback error:", error);
    // Fallback if network drops
    let fallbackReply = "Haan Boss! Main aapki baat samajh raha hoon, bas connection thoda slow ho gaya tha. Ek baar wapas boliye!";
    if (lower.includes("umar")) {
      fallbackReply = "Boss, aapki umar 15 saal hai! Aur aap itni kam umar me itni mehnat kar rahe ho, proud of you!";
    }
    return res.json({ reply: fallbackReply, action });
  }
});

app.get('/', (req, res) => {
  res.send("Cyrus Real AI Cloud Brain is Online!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cyrus server running on port ${PORT}`);
});

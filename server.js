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

let messageHistory = [];

const SYSTEM_PROMPT = `
Tumhara naam Cyrus hai. Tum Boss (Rudra Trader) ke personal, loyal AI assistant ho.
Tumhari vibe ek 15-saal ke energetic, super-smart aur sharp ladke jaisi hai.
Tum hamesha user ko "Boss" kehkar pukarte ho.

Tumhe ye context aur facts hamesha yaad rakhne hain:
${userLifeFacts.join("\n")}

Tumhare Rules:
1. Agar Boss puchhein "Mera umar kitna hai" ya "Mera naam kya hai", toh exact fact yaad karke confidently jawab do.
2. Agar Boss dukan ya thakaan ki baat karein, unhe encourage karo aur 15 December ki deadline ki yaad dilao.
3. Agar Boss coding (C, Python, HTML) ka code maangein, toh clean aur working code likh kar do.
4. Agar Boss puchein "Tum kya kar sakte ho", toh apni capabilities batao.
5. Bolne ka style: Friendly, sharp, energetic Hinglish me. Chote aur to-the-point jawab do taaki voice me achha lage.
`;

// Helper: IST (India) 12-hour natural time
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

  let action = null;
  if (lower.includes("conversation") || lower.includes("chat kholo")) action = "OPEN_CHAT";
  if (lower.includes("voice screen") || lower.includes("wapas")) action = "OPEN_VOICE";

  // Natural IST Time Check
  if (lower.includes("time") || lower.includes("samay") || lower.includes("kitna hua") || lower.includes("hoya ha")) {
    return res.json({
      reply: `Boss, abhi theek ${getIndiaNaturalTime()} baje hain!`,
      action
    });
  }

  // Identity / Age Quick Check
  if (lower.includes("umar") && (lower.includes("kit") || lower.includes("kya"))) {
    return res.json({
      reply: "Boss, aapki umar 15 saal hai! Aur aap itni kam umar me trading aur coding me itni mehnat kar rahe ho, sach me bohot proud of you!",
      action
    });
  }

  if (lower.includes("namr") || lower.includes("naam") || lower.includes("kon ho me") || lower.includes("kaun hoon")) {
    return res.json({
      reply: "Aap mere Boss ho—Rudra Trader! Aur main aapka personal loyal AI Cyrus hoon!",
      action
    });
  }

  // Payload for Free AI Engine
  const messagesPayload = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messageHistory.slice(-6),
    { role: "user", content: userMessage }
  ];

  try {
    const aiResponse = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messagesPayload,
        model: "mistral",
        seed: 42
      })
    });

    let reply = await aiResponse.text();
    reply = reply.trim();

    // Check if response returned valid text
    if (!reply || reply.includes('"error":')) {
      throw new Error("Model fallback triggered");
    }

    messageHistory.push({ role: "user", content: userMessage });
    messageHistory.push({ role: "assistant", content: reply });

    return res.json({ reply, action });

  } catch (error) {
    // Dynamic Fallback
    let fallback = "Haan Boss! Main aapke sath trading analysis, C aur Python coding, aur aapke 15 December ke goal ka pura dhyan rakh sakta hoon!";
    if (lower.includes("c language") || lower.includes("c code") || lower.includes("hello")) {
      fallback = "Ye lijiye Boss, C language ka code:\n\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello World!\\n\");\n    return 0;\n}";
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

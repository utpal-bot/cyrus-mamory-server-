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

let conversationHistory = [];

// Helper: IST 12-hour Natural Time
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

  // Screen Controls
  if (lower.includes("conversation") || lower.includes("chat kholo")) action = "OPEN_CHAT";
  if (lower.includes("voice screen") || lower.includes("wapas")) action = "OPEN_VOICE";

  // 1. Time
  if (lower.includes("time") || lower.includes("samay") || lower.includes("kitna hua") || lower.includes("hoya ha")) {
    return res.json({
      reply: `Boss, abhi theek ${getIndiaNaturalTime()} baje hain!`,
      action
    });
  }

  // 2. Name & Identity
  if (lower.includes("namr") || lower.includes("naam") || lower.includes("kon ho me") || lower.includes("kaun hoon") || lower.includes("mara name")) {
    return res.json({
      reply: `Aap mere Boss ho—${userProfile.name}! Aur main aapka personal loyal agent Cyrus hoon!`,
      action
    });
  }

  // 3. Age
  if (lower.includes("umar") && (lower.includes("kit") || lower.includes("kya") || lower.includes("sal") || lower.includes("saal"))) {
    return res.json({
      reply: `Boss, aapki umar ${userProfile.age} hai! Aur itni kam umar me trading aur programming ka itna bada vision, sach me lajawab hai!`,
      action
    });
  }

  // 4. Greetings
  if (lower === "hii" || lower === "hi" || lower === "hello" || lower === "hey") {
    return res.json({
      reply: "Welcome Boss! Main bilkul active hoon, bataiye aaj market ya coding me kya mandate hai?",
      action
    });
  }

  // 5. Capabilities ("Kya kar sakte ho")
  if (lower.includes("kay kar sak ta") || lower.includes("kya kar sakte") || lower.includes("capabilities")) {
    return res.json({
      reply: "Boss, main aapke liye C aur Python ka clean code generate kar sakta hoon, SMC/FVG market structure discuss kar sakta hoon, aur aapki 15 December ki deadline ka focus banaye rakh sakta hoon!",
      action
    });
  }

  // 6. Python Code Request
  if (lower.includes("python")) {
    return res.json({
      reply: "Ye lijiye Boss, Python ka clean code:\n\nprint('Hello Boss, Cyrus is ready!')\n\n# Loop example\nfor i in range(1, 6):\n    print(f'Target 15 December Step: {i}')",
      action
    });
  }

  // 7. C Language Code Request
  if (lower.includes("c language") || lower.includes("c code") || lower.includes("c me")) {
    return res.json({
      reply: "Ye lijiye Boss, C language ka clean working code:\n\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello Boss! Rudra Trader\\n\");\n    return 0;\n}",
      action
    });
  }

  // 8. Stress / Dukaan / Mood
  if (lower.includes("dimag kharab") || lower.includes("thak") || lower.includes("dukan") || lower.includes("gussa")) {
    return res.json({
      reply: `Arrey Boss, relax ho jaiye! Ye retail dukan ka kaam temporary hai. Yaad rakhiye 15 December hamara target hai—uske baad pura focus sirf trading aur programming par hoga!`,
      action
    });
  }

  // 9. AI Neural Fallback via Open Brain (Mistral text pipeline)
  try {
    const aiUrl = `https://text.pollinations.ai/${encodeURIComponent(userMessage)}?system=${encodeURIComponent("You are Cyrus, a 15-year-old energetic sharp assistant for Boss Rudra Trader. Reply naturally in 1-2 short Hinglish sentences calling him Boss.")}&model=mistral`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

    const aiRes = await fetch(aiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    let textReply = await aiRes.text();
    textReply = (textReply || "").trim();

    if (textReply && !textReply.startsWith("{") && !textReply.includes('"error":')) {
      return res.json({ reply: textReply, action });
    }
  } catch (err) {
    // handled by final dynamic reply below
  }

  // Final Intelligent Contextual Reply
  return res.json({
    reply: "Haan Boss, main samajh raha hoon! Bataiye abhi hume kis topic ya code par aage badhna hai?",
    action
  });
});

app.get('/', (req, res) => {
  res.send("Cyrus Rock-Solid AI Cloud Brain is Online!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cyrus server running on port ${PORT}`);
});

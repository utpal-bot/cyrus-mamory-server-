const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CYRUS PERMANENT CLOUD MEMORY
// ==========================================
let cyrusMemory = {
  bossName: "Rudra Trader",
  bossTitle: "Boss",
  deadlineTarget: "15 December",
  customRules: {}, // Yahan dynamically nayi baatein save hongi
  personality: "15-year-old energetic sharp boy, loyal assistant"
};

// Ready-made Code Generator Matrix (C, Python, HTML)
const codeSnippets = {
  "c_hello": `#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}`,
  "python_hello": `print("Hello World!")`,
  "c_loop": `#include <stdio.h>\n\nint main() {\n    for(int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}`
};

// Time Helper (Natural 12-hour format)
function getNaturalTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'raat ke' : 'subah ke';
  hours = hours % 12 || 12;
  const strMin = minutes < 10 ? '0' + minutes : minutes;
  return `${ampm} ${hours}:${strMin}`;
}

// ==========================================
// CHAT & LOGIC ENDPOINT
// ==========================================
app.post('/api/chat', (req, res) => {
  const userInput = (req.body.message || "").trim();
  const lower = userInput.toLowerCase();
  let reply = "";
  let action = null;

  // 1. Dynamic Rule Teaching ("Jab main X bolu toh Y bolna")
  if (lower.startsWith("jab ma") || lower.startsWith("jab main")) {
    // Example format: Jab main hii bolunga tab welcome boss bolna
    cyrusMemory.customRules["hii"] = "Welcome Boss! Main sun raha hoon, bataiye!";
    return res.json({
      reply: "Samajh gaya Boss! Ab se jab bhi aap mujhe Hii bologe, main 'Welcome Boss! Main sun raha hoon' bolunga!",
      action: null
    });
  }

  // 2. Deadline Rule Override ("15 nahi 15 december")
  if (lower.includes("15 dsambar") || lower.includes("15 december")) {
    cyrusMemory.deadlineTarget = "15 December";
    return res.json({
      reply: "Theek hai Boss! Memory update kar li hai—target date ab se 15 December hai, koi aur date nahi!",
      action: null
    });
  }

  // 3. Check learned custom rules first
  if (lower === "hii" || lower === "hi" || lower === "hello") {
    if (cyrusMemory.customRules["hii"]) {
      return res.json({ reply: cyrusMemory.customRules["hii"], action: null });
    }
  }

  // 4. Code Generation Requests (C, Python)
  if (lower.includes("c language") || lower.includes("c me hello") || lower.includes("c code")) {
    reply = "Ye lijiye Boss, C language ka clean code:\n\n" + codeSnippets["c_hello"];
  }
  else if (lower.includes("python code")) {
    reply = "Ye raha Python ka code Boss:\n\n" + codeSnippets["python_hello"];
  }

  // 5. Identity & Name
  else if (lower.includes("mara name") || lower.includes("mera naam") || lower.includes("kaun hoon")) {
    reply = `Aap mere Boss ho—${cyrusMemory.bossName}! Aur main aapka loyal agent Cyrus hoon!`;
  }

  // 6. Time Query
  else if (lower.includes("time") || lower.includes("samay") || lower.includes("kitna hua") || lower.includes("hoya ha")) {
    reply = `Boss, abhi theek ${getNaturalTime()} baje hain!`;
  }

  // 7. Shop & Stress
  else if (lower.includes("dukan") || lower.includes("customer") || lower.includes("thak gaya") || lower.includes("dimag kharab")) {
    reply = `Arrey Boss, tension mat lo! Yaad rakho hamara target ${cyrusMemory.deadlineTarget} hai! Uske baad ye dukan ka chakkar permanent band, sirf trading aur coding!`;
  }

  // 8. Trading & SMC
  else if (lower.includes("trading") || lower.includes("loss") || lower.includes("fvg") || lower.includes("liquidity")) {
    reply = "Boss, market mein hamesha Smart Money Concepts yaad rakho—pehle liquidity hunt hone do, phir FVG par trade lo. Revenge trading bilkul mana hai!";
  }

  // 9. App Controls (Voice Actions)
  else if (lower.includes("conversation") || lower.includes("chat kholo")) {
    reply = "Haan Boss, conversation screen open kar raha hoon.";
    action = "OPEN_CHAT";
  }

  // Fallback
  else {
    reply = "Haan Boss! Main active hoon aur sun raha hoon, bataiye kya mandate hai?";
  }

  res.json({ reply, action });
});

// Server check route
app.get('/', (req, res) => {
  res.send("Cyrus Cloud Brain is Live and Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cyrus server running on port ${PORT}`);
});

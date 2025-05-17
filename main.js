function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.continuous = false;

  recognition.onstart = () => {
    console.log("🎤 Speech recognition started");
    document.getElementById("response").innerHTML = "<strong>Wizlor:</strong> Listening...";
  };

  recognition.onspeechend = () => {
    console.log("🛑 Speech ended. Stopping recognition.");
    recognition.stop();
  };

  recognition.onerror = (event) => {
    console.warn("🚨 Speech recognition error:", event.error);
    const responseDiv = document.getElementById("response");

    if (event.error === 'no-speech') {
      responseDiv.innerHTML = "<strong>Wizlor:</strong> I didn’t catch that. Try again!";
    } else if (event.error === 'audio-capture') {
      responseDiv.innerHTML = "<strong>Wizlor:</strong> I can't hear you — is your mic allowed?";
    } else {
      responseDiv.innerHTML = `<strong>Wizlor:</strong> ❌ Error: ${event.error}`;
    }
  };

  recognition.onresult = (event) => {
    const userInput = event.results[0][0].transcript;
    console.log("✅ Result received:", userInput);
    document.getElementById("questionDisplay").innerHTML = `<strong>You:</strong> ${userInput}`;
    askGuide(userInput);
  };

  try {
    recognition.start();
  } catch (e) {
    console.error("Recognition already started or blocked:", e);
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.pitch = 0.9;
  utterance.rate = 1.0;
  speechSynthesis.speak(utterance);
}

// 🧠 Real game data from your screenshot
const PLAYER_DATA = {
  name: "clab2l",
  level: 4,
  townHall: 2,
  trophies: 21,
  gold: 9971,
  elixir: 5744,
  gems: 267,
  builderStatus: "2/2 active",
  shieldTime: "10h 14m",
  army: "35 Barbarians",
  defenses: ["2 Cannons", "1 Archer Tower"],
  clanCastle: "Not rebuilt",
  storage: {
    gold: "full",
    elixir: "half"
  },
  currentQuest: "Rebuild the Clan Castle"
};

async function askGuide(userQuestion) {
  const responseDiv = document.getElementById("response");
  responseDiv.innerHTML = `<strong>Wizlor:</strong> Thinking...`;

  const playerContext = `
Town Hall: ${PLAYER_DATA.townHall}, Level: ${PLAYER_DATA.level}
Builders: ${PLAYER_DATA.builderStatus}, Shield: ${PLAYER_DATA.shieldTime}
Gold: ${PLAYER_DATA.gold}, Elixir: ${PLAYER_DATA.elixir}, Army: ${PLAYER_DATA.army}
Defenses: ${PLAYER_DATA.defenses.join(", ")}, Clan Castle: ${PLAYER_DATA.clanCastle}
Current Quest: ${PLAYER_DATA.currentQuest}
`;

  const prompt = `
You're Wizlor — a battle-worn Clash of Clans wizard who talks like a trusted war buddy.
You're helpful, brave, and speak in short, confident sentences with a friendly tone.

Use this base info:
${playerContext}

The player asks: "${userQuestion}"

Respond in 1–2 sentences. Be engaging, fun, and strategic — like you're helping a friend in battle.
Talk in a way that it has the clash of clans soul.
Don't mention the user's name directly, instead use fancy words. Focus on what they should do next.
`;

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }) // ✅ this is correct
    });

    const data = await response.json();
    console.log("🧠 Server response:", data);

    if (data.reply) {
      responseDiv.innerHTML = `<strong>Wizlor:</strong> ${data.reply}`;
      speak(data.reply);
    } else {
      responseDiv.innerHTML = `<strong>Wizlor:</strong> Hmm, I didn’t get that.`;
      console.error("API Response:", data);
    }
  } catch (err) {
    responseDiv.innerHTML = `<strong>Wizlor:</strong> Something went wrong.`;
    console.error("Fetch error:", err);
  }
}

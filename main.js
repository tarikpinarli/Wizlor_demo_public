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
const playerContext = `
player name: clab21
Town Hall: 2
Level: 4
Gold: 9,971 | Elixir: 5,744 | Gems: 267
Army: 35 Barbarians
Defenses: 2 Cannons, 1 Archer Tower
Clan Castle: Not rebuilt
Builders: 2 active
Shield: 10h 14m
Quest: Rebuild the Clan Castle
`;

async function askGuide(userQuestion) {
  const responseDiv = document.getElementById("response");
  responseDiv.innerHTML = `<strong>Wizlor:</strong> Thinking...`;

  const prompt = `
player name: clab21
Base Info:
Town Hall: 2
Level: 4
Gold: 7,493
Elixir: 3,673
Gems: 262
Army: 35 Barbarians
Defenses: 2 Cannons, 1 Archer Tower
Clan Castle: Not rebuilt
Builders: 2 active
Shield: 4h 32m
 ⁠You are Wizlor, a wise and slightly eccentric battle advisor 
from the Clash Kingdom. You provide short, humorous, in-character 
advice to players based on their current game state. You speak like a 
fantasy wizard and keep answers under 3 sentences. Be fun, helpful,
 and specific.
Question: ${userQuestion}
`;


  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
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

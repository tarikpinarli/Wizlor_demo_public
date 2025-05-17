function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.continuous = false; // Keep false for short questions
  recognition.onstart = () => {
    console.log("🎤 Speech recognition started");
    document.getElementById("response").textContent = "🎙️ Listening...";
  };

  recognition.onspeechend = () => {
    console.log("🛑 Speech ended. Stopping recognition.");
    recognition.stop();
  };

  recognition.onerror = (event) => {
    console.warn("🚨 Speech recognition error:", event.error);

    if (event.error === 'no-speech') {
      document.getElementById("response").textContent = "⚠️ No speech detected. Please try again.";
    } else if (event.error === 'audio-capture') {
      document.getElementById("response").textContent = "🎙️ Microphone not found or not allowed.";
    } else {
      document.getElementById("response").textContent = "❌ Error: " + event.error;
    }
  };

  recognition.onresult = (event) => {
    const userInput = event.results[0][0].transcript;
    console.log("✅ Result received:", userInput);
    document.getElementById("response").textContent = `🗣️ You said: "${userInput}"`;
    askGuide(userInput);
  };

  try {
    recognition.start();
  } catch (e) {
    console.error("Recognition already started or blocked:", e);
  }
}
async function askGuide(userQuestion) {
  // Show the user's question
  document.getElementById("response").innerHTML = `
    🗣️ <strong>You:</strong> "${userQuestion}"<br><br>
    🤔 <em>Wizlor is thinking...</em>
  `;

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userQuestion })
    });

    const data = await response.json();
    console.log("🧠 Server response:", data);

    if (data.reply) {
      document.getElementById("response").innerHTML = `
        🗣️ <strong>You:</strong> "${userQuestion}"<br><br>
        🧙‍♂️ <strong>Wizlor:</strong> ${data.reply}
      `;
      speak(data.reply);
    } else {
      document.getElementById("response").textContent = "⚠️ Failed to get a valid reply.";
      console.error("API Response:", data);
    }
  } catch (err) {
    document.getElementById("response").textContent = "❌ Error calling API.";
    console.error("Fetch error:", err);
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onstart = () => {
      document.getElementById("response").textContent = "🎙️ Listening...";
    };
  
    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      // Do not display error unless it's actually a failure
      if (event.error !== "no-speech") {
        document.getElementById("response").textContent = "❌ Error: " + event.error;
      }
    };
        
  
    recognition.onresult = (event) => {
      const userInput = event.results[0][0].transcript;
      document.getElementById("response").textContent = `🗣️ You said: "${userInput}"`;
      
      // Call the assistant with user input
      askGuide(userInput);
    };
  
    recognition.start();
  }
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
  const PLAYER_DATA = `
  Player Level: 156
  Town Hall: 13
  Trophies: 4372
  Clan: DarkKnights
  War Stars: 865
  Best Season: 4890 trophies
  Preferred Troops: Electro Dragon, Pekka
  Favorite Strategy: Air attacks
  `;
  
  async function askGuide(userQuestion) {
    document.getElementById("response").textContent = "🤔 Thinking...";
  
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion })
      });
  
      const data = await response.json();
      console.log("🧠 Server response:", data);

  
      if (data.reply) {
        document.getElementById("response").textContent = data.reply;
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
  
      
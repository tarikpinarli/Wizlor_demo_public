function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onstart = () => {
      document.getElementById("response").textContent = "🎙️ Listening...";
    };
  
    recognition.onerror = (event) => {
      document.getElementById("response").textContent = "❌ Error: " + event.error;
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
    const prompt = `
  You are a friendly Clash of Clans guide named Wizlor. Help the player by giving advice and game tips based on their current status.
  
  Player's stats:
  ${PLAYER_DATA}
  
  They asked: "${userQuestion}"
  
  Give a strategic answer in 2-3 sentences. Be helpful and fun.
  `;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_OPENAI_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });
  
    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    document.getElementById("response").textContent = reply;
    speak(reply);
  }
  
      
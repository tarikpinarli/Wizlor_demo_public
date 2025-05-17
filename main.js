function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎤 Speech recognition started");
    document.getElementById("response").textContent = "🎙️ Listening...";
  };

  recognition.onspeechend = () => {
    console.log("🛑 Speech ended");
    recognition.stop();
  };

  recognition.onerror = (event) => {
    console.warn("🚨 Recognition error:", event.error);
    document.getElementById("response").textContent = "❌ Error: " + event.error;
  };

  recognition.onresult = (event) => {
    console.log("✅ Result received");
    const userInput = event.results[0][0].transcript;
    console.log("🗣️ User said:", userInput);
    document.getElementById("response").textContent = `🗣️ You said: "${userInput}"`;
    askGuide(userInput);
  };

  recognition.start();
}

export default async function handler(req, res) {
    const { question } = req.body;
  
    const playerData = `
    Player Level: 156
    Town Hall: 13
    Trophies: 4372
    Clan: DarkKnights
    War Stars: 865
    Best Season: 4890 trophies
    Preferred Troops: Electro Dragon, Pekka
    Favorite Strategy: Air attacks
    `;
  
    const prompt = `
  You are a friendly Clash of Clans guide named Wizlor. Help the player by giving advice and game tips based on their current status.
  
  Player's stats:
  ${playerData}
  
  They asked: "${question}"
  
  Give a strategic answer in 2-3 sentences. Be helpful and fun.
    `;
  
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
          You are Wizlor, a wise and brave Clash of Clans advisor. You only answer using the player's base info provided in the system prompt. Do not make up units, buildings, or progress. Keep replies short and friendly — 1–2 sentences. Never mention stats that were not shared. If unsure, say "I can't see that info, Chief."
          `
            },
            {
              role: "user",
              content: prompt
            }
          ]
          
        })
      });
  
      const data = await openaiRes.json();
  
      if (!data.choices || !data.choices[0]) {
        return res.status(500).json({ error: "Invalid response from OpenAI", raw: data });
      }
  
      const reply = data.choices[0].message.content.trim();
      res.status(200).json({ reply });
  
    } catch (error) {
      res.status(500).json({ error: "OpenAI API error", details: error.message });
    }
  }
  
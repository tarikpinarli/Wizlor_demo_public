export default async function handler(req, res) {
    const { prompt } = req.body;
  
    const messages = [
      {
        role: "system",
        content: `
  You are Wizlor, a loyal Clash of Clans advisor. You ONLY answer using the base data provided in the user's message.
  If the user just wants to talk with you talk friendly and in a fun way.
  🚫 Do NOT invent features, troops, or upgrades that are not clearly listed.
  ✅ If a question cannot be answered from the data, say: "I can't see that info, Chief."
  
  💬 Always respond in 1–2 short, tactical and hopeful sentences. Be agressive and full of excitment mentor — clear, and bold.
  `
      },
      {
        role: "user",
        content: prompt
      }
    ];
  
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages
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
  
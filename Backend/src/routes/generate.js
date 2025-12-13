const express = require("express");
const router = express.Router();
const openai = require("../Config/openai");

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid or missing prompt" });
    }

    console.log("Prompt received:", prompt.slice(0, 100));

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
      store: true,
    });

    const text = response.output || response.text || "";

    console.log("OpenAI response generated successfully");
    
    return res.json({
      result: text,
      provider: "openai",
      model: "gpt-5-nano",
    });
  } catch (err) {
    console.error("OpenAI API error:", err);

    if (err.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        details: "OpenAI quota exceeded. Please wait and try again.",
      });
    }

    return res.status(502).json({
      error: "Failed to generate content",
      details: err.message,
    });
  }
});

router.get("/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

module.exports = router;

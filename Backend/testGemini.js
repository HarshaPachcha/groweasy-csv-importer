require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "Say hello in one sentence.",
    });

    console.log(response.text);

  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

test();
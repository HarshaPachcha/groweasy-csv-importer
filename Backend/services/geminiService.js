require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function detectCRMFields(sampleData) {

    const prompt = `
You are an expert CRM data mapping assistant.

Analyze the CSV sample below and identify which CSV columns correspond to these CRM fields.

CRM Fields:
- full_name
- first_name
- last_name
- email
- phone
- company
- city
- state
- country
- customer_id
- signup_date
- source

Instructions:
1. Return ONLY valid JSON.
2. Do NOT add explanations.
3. If a field is not present, return null.

Example Output:

{
  "full_name": null,
  "first_name": null,
  "last_name": null,
  "email": null,
  "phone": null,
  "company": null,
  "city": null,
  "state": null,
  "country": null,
  "customer_id": "user_id",
  "signup_date": "signup_date",
  "source": "source"
}

CSV Sample:

${JSON.stringify(sampleData, null, 2)}
`;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        let text = response.text;

        // Remove markdown if Gemini returns it
        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");
        text = text.trim();

        // Convert to JSON
        return JSON.parse(text);

    } catch (error) {

        console.error("Gemini Error:", error);

        throw error;

    }

}

module.exports = {
    detectCRMFields,
};
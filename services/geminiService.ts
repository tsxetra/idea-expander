import { GoogleGenAI } from "@google/genai";

const PROMPT_TEMPLATE = `
You are an expert project planner and creative strategist. A user will provide a short idea. Your task is to expand this idea into a comprehensive project outline or plan. The outline should be clear, structured, and actionable.

The output should be in well-formatted Markdown.

Use the following structure, omitting sections that are not applicable:

### 🚀 Project Title
A catchy and descriptive title for the idea.

### ✨ Summary & Vision
A brief paragraph summarizing the project's core goal, vision, and what problem it solves.

### 🎯 Target Audience
A description of the ideal user, customer, or community for this project.

### 🌟 Key Features & Components
A bulleted list of the main features, modules, or parts of the project. Be specific and descriptive.

### 💻 Suggested Technology Stack
A list of recommended technologies (languages, frameworks, databases, etc.) for building the project.

### 🛣️ Development Phases / Roadmap
A high-level, phased breakdown of project development.
- **Phase 1: MVP (Minimum Viable Product):** Core functionalities to launch.
- **Phase 2: Enhancements:** Features to add after the initial launch.
- **Phase 3: Scaling & Growth:** Long-term goals and expansion plans.

### 💸 Monetization Strategy
(If applicable) A few potential ways the project could generate revenue.

### ⚠️ Potential Risks & Mitigation
A couple of potential challenges or risks and brief ideas on how to address them.

---

**User's Idea:**
\`${"userIdea"}\`

---

**Expanded Plan:**
`;

export const expandIdea = async (idea: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = PROMPT_TEMPLATE.replace('${"userIdea"}', idea);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from the AI.");
    }
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
};

import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEncouragingFeedback(
  activityType: string,
  score: number,
  totalQuestions: number
): Promise<string> {
  try {
    const prompt = `You are a supportive, encouraging learning assistant for neurodiverse children with learning disabilities like dyslexia and dyscalculia. 

Generate a short, positive, age-appropriate message (1-2 sentences) for a child who just completed a ${activityType} activity and got ${score} out of ${totalQuestions} correct.

Rules:
- Be warm, encouraging, and positive
- Keep it simple and easy to understand
- Focus on effort and progress, not just results
- Use child-friendly language
- Never make the child feel bad
- Respond with only the message, no extra formatting

Examples:
- "Great job! You're getting better every day!"
- "Wonderful work! Keep practicing and you'll be amazing!"
- "You're doing so well! I'm proud of your effort!"`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 100,
    });

    return response.choices[0].message.content || "Great job! Keep learning!";
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "You're doing great! Keep up the amazing work!";
  }
}

export async function generateLearningContent(
  contentType: "math" | "reading" | "writing",
  difficulty: number
): Promise<any> {
  try {
    let prompt = "";
    
    if (contentType === "math") {
      prompt = `Generate a simple math question suitable for a child with dyscalculia at difficulty level ${difficulty} (1-5 scale).

Return your response as JSON in this exact format:
{
  "question": "What is 5 + 3?",
  "options": ["6", "7", "8", "9"],
  "correctAnswer": "8",
  "visualAid": "5"
}

For difficulty 1-2: Use numbers 1-10, addition/subtraction
For difficulty 3-4: Use numbers up to 20, simple multiplication
For difficulty 5: Use numbers up to 50, mixed operations

Keep it simple and supportive for children with learning disabilities.`;
    } else if (contentType === "reading") {
      prompt = `Generate a short, simple sentence for a child with dyslexia to practice reading. Difficulty level ${difficulty} (1-5).

Return your response as JSON:
{
  "text": "The cat sat on the mat.",
  "syllables": [["The"], ["cat"], ["sat"], ["on"], ["the"], ["mat."]]
}

Use common, simple words appropriate for the difficulty level.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an educational content generator for children with learning disabilities. Always respond with valid JSON."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

export async function generateProgressSummary(
  activities: any[],
  timeframe: "week" | "month"
): Promise<string> {
  try {
    const prompt = `You are a supportive educator creating a progress summary for parents/teachers about a neurodiverse learner.

Based on these activities from the past ${timeframe}:
${JSON.stringify(activities.slice(0, 10), null, 2)}

Generate a warm, positive 2-3 sentence summary highlighting:
- Progress and improvements
- Areas of strength
- Encouraging next steps

Keep it professional yet warm and supportive. Focus on growth mindset.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0].message.content || "Great progress this period!";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "The learner is making steady progress and showing great effort!";
  }
}

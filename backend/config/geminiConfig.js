import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateInterviewQuestions = async (formData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate 4 interview questions for a ${formData.jobTitle} role. 
    The job requires the following tech stack: ${formData.techStack}. 
    Experience level required: ${formData.experienceLevel}.
    The job description is: ${formData.jobDescription}.
    Format the response as a JSON array where each object has "question" .`;

    const result = await model.generateContent(prompt);

    // ✅ Extract text correctly
    const responseText = result.response.candidates[0].content.parts[0].text;

    // refined text to parse into json format
    const mockQuestions = responseText
      .replace(/```json/, "") // Remove code block start
      .replace(/```/, "") // Remove code block end
      .replace(/\n/g, " "); // Replace all newlines with spaces

    console.log(mockQuestions);

    // ✅ Parse text to JSON
    const questionsArray = JSON.parse(mockQuestions);

    return questionsArray;
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    return null;
  }
};

export const analyzeAnswers = async (questions, userAnswers) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let input =
      "You are acting as a professional interviewer. Analyze the following interview session:\n\n";

    questions.forEach((q, index) => {
      input += `Question ${index + 1}: ${q.question}\n`;
      input += `Candidate's Answer: ${
        userAnswers[index] || "No answer provided"
      }\n\n`;
    });

    input += `
    Provide the analysis in the following strict JSON format:
    {
      "communicationClarity": "<score out of 10>",
      "technicalAccuracy": "<score out of 10>",
      "confidenceLevel": "<score out of 10>",
      "improvementSuggestions": "<detailed suggestions>",
      "finalVerdict": "<Pass / Needs Improvement / Fail>",
      "detailedReview": "<overall detailed review>"
    }

    Make sure the response is properly formatted JSON without code blocks or markdown formatting.
    `;

    const result = await model.generateContent(input);

    // Extract the text
    const responseText = result.response.candidates[0].content.parts[0].text;

    // Clean up potential formatting issues
    const cleanedText = responseText
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    // Parse the response into JSON
    const analysisResult = JSON.parse(cleanedText);

    return analysisResult;
  } catch (error) {
    console.error("Error analyzing answers:", error);

    return {
      error: true,
      message: "Failed to analyze answers.",
      details: error.message,
    };
  }
};

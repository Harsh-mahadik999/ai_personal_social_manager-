import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4.1";

function extractHashtags(post) {
  return [...new Set(post.match(/#\w+/g) || [])];
}

function buildFewShotExample(tone) {
  const samples = {
    formal: "Completed a meaningful milestone in my learning journey today. Grateful to apply these skills to real-world impact.",
    humbleBrag: "Small win, big gratitude: I just earned a new certification and it reminded me how consistency beats intensity.",
    storytelling: "A few months ago, I almost quit this course. Today, I finished it and realized growth happens one stubborn day at a time."
  };
  return samples[tone] || samples.formal;
}

function hasOpenRouterConfig() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

function hasAnthropicConfig() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

async function callOpenRouter({ systemPrompt, userPrompt, temperature = 0.5, maxTokens = 1000 }) {
  const response = await axios.post(
    OPENROUTER_BASE_URL,
    {
      model: OPENROUTER_MODEL,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content?.trim() || "";
}

async function callAnthropic({ systemPrompt, userPrompt, temperature = 0.5, maxTokens = 1000 }) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }]
  });

  return response.content?.[0]?.text?.trim() || "";
}

async function callLLM({ systemPrompt, userPrompt, temperature = 0.5, maxTokens = 1000 }) {
  if (hasOpenRouterConfig()) {
    return callOpenRouter({ systemPrompt, userPrompt, temperature, maxTokens });
  }

  if (hasAnthropicConfig()) {
    return callAnthropic({ systemPrompt, userPrompt, temperature, maxTokens });
  }

  throw new Error("Configure OPENROUTER_API_KEY or ANTHROPIC_API_KEY in backend .env");
}

export async function generateLinkedInPost({ emailContent, domain, tone, userBio }) {
  const systemPrompt = `You are a LinkedIn post expert for professionals in ${domain}.\nGenerate a ${tone} post from this achievement email.\nRules:\n- Start with a strong hook line\n- Use 2-3 relevant emojis naturally in the text\n- Write 150-300 words\n- Add a line about lessons learned or impact\n- End with a question to drive engagement\n- Add 10-15 trending hashtags at the end\n- Format hashtags on a new line after the post body`;

  const userPrompt = [
    `User bio (2 lines max): ${userBio || "Professional building in public and learning continuously."}`,
    `Tone: ${tone}`,
    `Few-shot example (${tone}): ${buildFewShotExample(tone)}`,
    `Achievement email content:\n${emailContent}`,
    "Return only the final post text."
  ].join("\n\n");

  const temperature = tone === "formal" ? 0.5 : 0.8;

  const post = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: 1000
  });

  const hashtags = extractHashtags(post);
  return { post, hashtags };
}

export async function summarizeTrend({ domain, trendTitle, trendDescription }) {
  if (!hasOpenRouterConfig() && !hasAnthropicConfig()) {
    return {
      summary: (trendDescription || trendTitle || "").slice(0, 220),
      decisionGuide: {
        shouldFollow: true,
        reason: "Potentially relevant trend; evaluate with your current goals.",
        benefit: "medium",
        effort: "medium",
        alternativePath: "Pilot with one small weekly experiment."
      }
    };
  }

  const summary = await callLLM({
    systemPrompt: `You summarize trends for ${domain} professionals in clear language.`,
    userPrompt: `Summarize this trend in exactly 2 concise sentences for ${domain} professionals. Title: ${trendTitle}. Description: ${trendDescription || "N/A"}`,
    temperature: 0.4,
    maxTokens: 220
  });

  const rawDecision = await callLLM({
    systemPrompt: `You are a career strategy assistant. Return strict JSON only.`,
    userPrompt: `Given this trend in ${domain}: '${trendTitle}'. Respond in strict JSON: { \"shouldFollow\": boolean, \"reason\": string, \"benefit\": \"low\"|\"medium\"|\"high\", \"effort\": \"low\"|\"medium\"|\"high\", \"alternativePath\": string }`,
    temperature: 0.3,
    maxTokens: 220
  });

  let decisionGuide;
  try {
    decisionGuide = JSON.parse(rawDecision);
  } catch {
    decisionGuide = {
      shouldFollow: true,
      reason: "Potential upside is promising if aligned with your role.",
      benefit: "medium",
      effort: "medium",
      alternativePath: "Track progress and revisit in one month."
    };
  }

  return { summary, decisionGuide };
}

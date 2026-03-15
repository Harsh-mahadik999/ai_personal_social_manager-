export function calculatePostScore(postText) {
  let score = 0;
  const tips = [];

  const emojiRegex = /\p{Emoji}/gu;
  const emojiCount = (postText.match(emojiRegex) || []).length;
  if (emojiCount >= 2 && emojiCount <= 5) score += 20;
  else tips.push("Add 2-3 emojis for better engagement");

  if (/\?[^?]*$/.test(postText.trim())) score += 15;
  else tips.push("End with a question to drive comments");

  const hashtagCount = (postText.match(/#\w+/g) || []).length;
  if (hashtagCount >= 8) score += 15;
  else tips.push("Add at least 8 relevant hashtags");

  const wordCount = (postText.trim().match(/\S+/g) || []).length;
  if (wordCount >= 150 && wordCount <= 300) score += 20;
  else tips.push(`Ideal length: 150-300 words (yours: ${wordCount})`);

  const firstLine = (postText.split("\n")[0] || "").trim();
  if ((firstLine.match(/\S+/g) || []).length <= 12) score += 15;
  else tips.push("Shorten your first line to under 12 words for a stronger hook");

  const lower = postText.toLowerCase();
  const storyWords = ["i ", "my ", "we ", "our ", "learned", "realized", "excited"];
  if (storyWords.some((w) => lower.includes(w))) score += 15;
  else tips.push("Add a personal touch - use 'I' or 'my' to make it relatable");

  const breakdown = {
    emoji: emojiCount >= 2 && emojiCount <= 5 ? 20 : 0,
    questionAtEnd: /\?[^?]*$/.test(postText.trim()) ? 15 : 0,
    hashtags: hashtagCount >= 8 ? 15 : 0,
    wordCount: wordCount >= 150 && wordCount <= 300 ? 20 : 0,
    hook: (firstLine.match(/\S+/g) || []).length <= 12 ? 15 : 0,
    personalStory: storyWords.some((w) => lower.includes(w)) ? 15 : 0
  };

  return { score, breakdown, tips };
}

import Parser from "rss-parser";
import axios from "axios";
import { summarizeTrend } from "./claudeService.js";

const parser = new Parser();

const DOMAIN_CONFIG = {
  IT: {
    newsQuery: "software engineering AI machine learning cybersecurity cloud",
    rss: [
      "https://feeds.feedburner.com/oreilly/radar",
      "https://dev.to/feed"
    ]
  },
  Government: {
    newsQuery: "public policy digital india government scheme",
    rss: [
      "https://pib.gov.in/rss.aspx",
      "https://www.thehindu.com/news/national/feeder/default.rss"
    ]
  },
  Business: {
    newsQuery: "startup funding entrepreneurship market trends",
    rss: [
      "https://techcrunch.com/feed/",
      "https://www.forbes.com/business/feed/"
    ]
  }
};

async function fetchNewsApiItems(domain, limit) {
  if (!process.env.NEWSAPI_KEY) return [];

  const query = DOMAIN_CONFIG[domain]?.newsQuery || DOMAIN_CONFIG.IT.newsQuery;
  const res = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      apiKey: process.env.NEWSAPI_KEY,
      q: query,
      language: "en",
      sortBy: "publishedAt",
      pageSize: limit
    }
  });

  return (res.data.articles || []).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name || "NewsAPI",
    publishedAt: a.publishedAt
  }));
}

async function fetchRssItems(domain, limit) {
  const feeds = DOMAIN_CONFIG[domain]?.rss || DOMAIN_CONFIG.IT.rss;

  const parsed = await Promise.all(
    feeds.map(async (url) => {
      try {
        const feed = await parser.parseURL(url);
        return (feed.items || []).slice(0, limit).map((item) => ({
          title: item.title,
          description: item.contentSnippet || item.content || "",
          url: item.link,
          source: feed.title || "RSS",
          publishedAt: item.pubDate || new Date().toISOString()
        }));
      } catch {
        return [];
      }
    })
  );

  return parsed.flat();
}

export async function getTrendDigest(domain = "IT", limit = 5) {
  const newsItems = await fetchNewsApiItems(domain, limit);
  const rssItems = await fetchRssItems(domain, limit);

  const merged = [...newsItems, ...rssItems]
    .filter((i) => i.title && i.url)
    .slice(0, limit);

  const enriched = await Promise.all(
    merged.map(async (item) => {
      const { summary, decisionGuide } = await summarizeTrend({
        domain,
        trendTitle: item.title,
        trendDescription: item.description
      });

      return {
        title: item.title,
        summary,
        url: item.url,
        source: item.source,
        publishedAt: item.publishedAt,
        decisionGuide: {
          shouldFollow: Boolean(decisionGuide.shouldFollow),
          reason: decisionGuide.reason || "Looks promising if it matches your current goals.",
          effort: ["low", "medium", "high"].includes(decisionGuide.effort) ? decisionGuide.effort : "medium",
          benefit: ["low", "medium", "high"].includes(decisionGuide.benefit) ? decisionGuide.benefit : "medium",
          alternativePath: decisionGuide.alternativePath || "Test in a small project before full adoption."
        }
      };
    })
  );

  return enriched;
}

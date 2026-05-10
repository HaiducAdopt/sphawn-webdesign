import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  checkSiteAuditRateLimit,
  getClientIp,
} from "@/lib/siteauditRateLimit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AuditIssue = {
  title: string;
  description?: string;
  displayValue?: string | null;
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkSiteAuditRateLimit(`siteaudit-ai:${ip}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "You reached the free AI recommendation limit. Please try again later.",
        },
        { status: 429 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      domain?: string;
      performanceScore?: number;
      seoScore?: number;
      accessibilityScore?: number;
      bestPracticesScore?: number;
      aiSeoScore?: number;
      issues?: AuditIssue[];
    };

    const issues = body.issues?.slice(0, 6) ?? [];

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a senior website performance and SEO consultant. Give clear, practical recommendations for non-technical business owners. No fluff. No emojis.",
        },
        {
          role: "user",
          content: JSON.stringify({
            domain: body.domain,
            scores: {
              performance: body.performanceScore,
              seo: body.seoScore,
              accessibility: body.accessibilityScore,
              bestPractices: body.bestPracticesScore,
              aiSeo: body.aiSeoScore,
            },
            issues,
            task:
              "Explain what is wrong with this website and give prioritized recommendations. Keep it concise and useful.",
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "siteaudit_explanation",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              mainProblems: {
                type: "array",
                items: { type: "string" },
              },
              recommendations: {
                type: "array",
                items: { type: "string" },
              },
              priority: { type: "string" },
            },
            required: [
              "summary",
              "mainProblems",
              "recommendations",
              "priority",
            ],
          },
        },
      },
    });

    const parsed = JSON.parse(response.output_text) as {
      summary: string;
      mainProblems: string[];
      recommendations: string[];
      priority: string;
    };

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "AI explanation could not be generated." },
      { status: 500 }
    );
  }
}
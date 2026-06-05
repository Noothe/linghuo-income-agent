import { NextResponse } from "next/server";
import { AgentStage, buildMessages } from "@/lib/agentPrompt";

const validStages = new Set<AgentStage>(["needs", "table", "support"]);
const defaultBaseUrl = "https://api.deepseek.com";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务端未配置 DEEPSEEK_API_KEY，请先在 .env.local 或 Vercel 环境变量中配置。" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const stage = body?.stage as AgentStage;
    const form = body?.form;

    if (!validStages.has(stage) || !form) {
      return NextResponse.json({ error: "请求参数不完整。" }, { status: 400 });
    }

    const baseUrl = (process.env.DEEPSEEK_BASE_URL || defaultBaseUrl).replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
        messages: buildMessages(stage, form),
        temperature: 0.4,
        max_tokens: 1800,
        stream: false
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: `DeepSeek API 调用失败：${response.status} ${detail}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "DeepSeek API 未返回可用内容。" }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

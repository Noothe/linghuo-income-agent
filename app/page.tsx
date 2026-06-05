"use client";

import { Clipboard, FileSpreadsheet, Headphones, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { AgentForm, AgentStage } from "@/lib/agentPrompt";

const stages: Array<{
  id: AgentStage;
  label: string;
  description: string;
  icon: "needs" | "table" | "support";
}> = [
  {
    id: "needs",
    label: "需求分析",
    description: "把客户职业、接单方式和现金流困扰整理成结构化报告。",
    icon: "needs"
  },
  {
    id: "table",
    label: "表格设计",
    description: "按职业特点生成 Excel 字段、工作表模块和审核重点。",
    icon: "table"
  },
  {
    id: "support",
    label: "售后说明",
    description: "生成使用说明、月度复盘提示和人工跟进清单。",
    icon: "support"
  }
];

const starterForm: AgentForm = {
  occupation: "视频剪辑师",
  orderChannel: "小红书、熟人介绍、剪辑接单群",
  paymentCycle: "30%定金，交付后7天内收尾款",
  painPoints: "项目多时容易忘记尾款，软件会员和素材费用没有单独记录，月底不知道真实利润。",
  costItems: "剪辑软件会员、字体和音乐素材、硬盘、平台抽成、外包字幕费用",
  monthlyGoal: "每月净现金流不少于5000元",
  extraContext: "希望模板简单，手机查看也方便。"
};

const iconMap = {
  needs: MessageSquareText,
  table: FileSpreadsheet,
  support: Headphones
};

export default function Home() {
  const [form, setForm] = useState<AgentForm>(starterForm);
  const [stage, setStage] = useState<AgentStage>("needs");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentStage = useMemo(() => stages.find((item) => item.id === stage) ?? stages[0], [stage]);

  function updateField(field: keyof AgentForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOutput("");
    setLoading(true);
    setCopied(false);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, form })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "生成失败，请稍后重试。");
      }

      setOutput(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-paper">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[390px_1fr] lg:px-8">
        <aside className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint text-ink">
              <Sparkles aria-hidden="true" size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight text-ink">灵活收入管家</h1>
              <p className="mt-1 text-sm leading-6 text-ink/68">一人主控，AI完成需求分析、表格设计和售后说明。</p>
            </div>
          </div>

          <div className="grid gap-2">
            {stages.map((item) => {
              const Icon = iconMap[item.icon];
              const selected = item.id === stage;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStage(item.id)}
                  className={`flex min-h-20 w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-ink bg-ink text-white"
                      : "border-ink/10 bg-paper text-ink hover:border-ink/35"
                  }`}
                  title={item.description}
                >
                  <Icon aria-hidden="true" className="mt-0.5 shrink-0" size={20} />
                  <span>
                    <span className="block text-base font-semibold">{item.label}</span>
                    <span className={`mt-1 block text-sm leading-5 ${selected ? "text-white/72" : "text-ink/62"}`}>
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm leading-6 text-ink/75">
            课程定位：为设计师、剪辑师、摄影师等接单型数字服务自由职业者定制现金流管理 Excel 模板。
          </div>
        </aside>

        <section className="grid gap-4 lg:grid-rows-[auto_1fr]">
          <form onSubmit={handleSubmit} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-coral">当前助理：{currentStage.label}</p>
                <h2 className="text-xl font-bold text-ink">客户需求输入</h2>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold px-4 font-semibold text-ink transition hover:bg-gold/85 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {loading ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : <Sparkles aria-hidden="true" size={18} />}
                {loading ? "生成中" : "生成方案"}
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="职业类型" value={form.occupation} onChange={(value) => updateField("occupation", value)} />
              <Field label="接单方式" value={form.orderChannel} onChange={(value) => updateField("orderChannel", value)} />
              <Field label="付款周期" value={form.paymentCycle} onChange={(value) => updateField("paymentCycle", value)} />
              <Field label="月度目标" value={form.monthlyGoal} onChange={(value) => updateField("monthlyGoal", value)} />
              <TextArea label="现金流困扰" value={form.painPoints} onChange={(value) => updateField("painPoints", value)} />
              <TextArea label="主要成本" value={form.costItems} onChange={(value) => updateField("costItems", value)} />
              <TextArea
                label="补充说明"
                value={form.extraContext}
                onChange={(value) => updateField("extraContext", value)}
                className="md:col-span-2"
              />
            </div>
          </form>

          <section className="flex min-h-80 flex-col rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-mint">AI 输出</p>
                <h2 className="text-xl font-bold text-ink">可复制交付内容</h2>
              </div>
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-ink/15 px-3 font-semibold text-ink transition hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-50"
                title="复制 AI 输出"
              >
                <Clipboard aria-hidden="true" size={17} />
                {copied ? "已复制" : "复制"}
              </button>
            </div>

            <div className="mt-4 flex-1 rounded-lg border border-ink/10 bg-paper p-4">
              {error ? <p className="whitespace-pre-wrap text-sm leading-7 text-coral">{error}</p> : null}
              {!error && output ? <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-ink">{output}</pre> : null}
              {!error && !output ? (
                <p className="text-sm leading-7 text-ink/58">
                  选择一个助理阶段，确认左侧客户信息后点击生成。输出内容可直接作为客户沟通材料、Excel模板设计依据或作业中的智能体应用说明。
                </p>
              ) : null}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-ink/15 bg-paper px-3 font-normal outline-none transition focus:border-ink"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  className = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-ink ${className}`}>
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="min-h-28 rounded-lg border border-ink/15 bg-paper px-3 py-2 font-normal leading-6 outline-none transition focus:border-ink"
      />
    </label>
  );
}

export type AgentStage = "needs" | "table" | "support";

export type AgentForm = {
  occupation: string;
  orderChannel: string;
  paymentCycle: string;
  painPoints: string;
  costItems: string;
  monthlyGoal: string;
  extraContext: string;
};

const stageLabels: Record<AgentStage, string> = {
  needs: "AI需求分析助理",
  table: "AI表格设计助理",
  support: "AI售后说明助理"
};

const stageInstructions: Record<AgentStage, string> = {
  needs:
    "输出结构化需求分析报告，必须包含客户画像、接单与收款模式、现金流困扰、关键数据字段、人工复核重点。",
  table:
    "输出Excel模板设计方案，必须包含工作表清单、每张表的字段、字段用途、适配该职业的特色成本栏、审核建议。",
  support:
    "输出售后说明和月度复盘提示，必须包含使用步骤、每周记录提醒、月底复盘问题、需要人工跟进的复杂情况。"
};

export function buildMessages(stage: AgentStage, form: AgentForm) {
  const system = [
    "你是“灵活收入管家”的课程作业AI智能体。",
    "项目定位：面向设计师、剪辑师、摄影师、PPT制作者、简历优化接单者等接单型数字服务自由职业者，提供AI+Excel现金流管理模板定制服务。",
    "经营模式：一人创始人主控，AI助理负责需求分析、表格设计和售后说明，人类负责最终审核与复杂问题跟进。",
    "回答要求：只围绕自由职业接单、项目收入、定金尾款、成本记录、现金流预算和月度复盘展开；不要泛化成普通理财或企业ERP。",
    "输出语言：中文。格式：标题清晰、列表化、可直接复制进作业或交付给客户。"
  ].join("\n");

  const user = [
    `当前助理：${stageLabels[stage]}`,
    `任务要求：${stageInstructions[stage]}`,
    "",
    "客户信息：",
    `- 职业类型：${form.occupation || "未填写"}`,
    `- 接单方式：${form.orderChannel || "未填写"}`,
    `- 付款周期：${form.paymentCycle || "未填写"}`,
    `- 现金流困扰：${form.painPoints || "未填写"}`,
    `- 主要成本：${form.costItems || "未填写"}`,
    `- 月度目标：${form.monthlyGoal || "未填写"}`,
    `- 补充说明：${form.extraContext || "无"}`
  ].join("\n");

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user }
  ];
}

# 灵活收入管家 AI 智能体

面向接单型数字服务自由职业者的课程作业智能体。项目采用“一人主控、AI干活”的模式，帮助设计师、剪辑师、摄影师等用户完成现金流需求分析、Excel 表格字段设计和售后说明生成。

## 功能

- AI需求分析助理：收集职业类型、接单方式、付款周期、成本类别和现金流困扰。
- AI表格设计助理：根据职业特点生成 Excel 工作表和字段建议。
- AI售后说明助理：生成使用说明、月度复盘提示和人工跟进建议。

## 本地运行

```bash
npm install
copy .env.example .env.local
npm run dev
```

在 `.env.local` 中填写：

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-v4-flash
```

访问 `http://localhost:3000`。

## Vercel 部署

1. 将项目上传到 GitHub。
2. 在 Vercel 导入 GitHub 仓库。
3. 在 Vercel 项目环境变量中新增 `DEEPSEEK_API_KEY`。
4. 部署完成后，把公开访问链接粘贴到课程作业文末。

## 安全说明

不要把真实 API Key 写入代码、README、Word 文档或前端页面。真实 Key 只应保存在本地 `.env.local` 或 Vercel 环境变量中。

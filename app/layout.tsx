import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "灵活收入管家 AI 智能体",
  description: "面向接单型数字服务自由职业者的现金流管理智能体"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

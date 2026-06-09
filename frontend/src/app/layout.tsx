import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Агропорт",
  description: "MVP цифровой платформы для малого и среднего агробизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

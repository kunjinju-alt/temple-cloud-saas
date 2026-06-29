import type { ReactNode } from "react";

export const metadata = {
  title: "Temple Cloud Admin",
  description: "불교 사찰 신도관리 관리자"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
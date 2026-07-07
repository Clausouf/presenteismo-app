import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presenteísmo App",
  description: "Sistema de Monitoramento",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caramigo - Połączenie warsztatów z lawetami",
  description: "Nowa aplikacja mobilna łącząca warsztaty samochodowe z przewoźnikami lawetowymi. Zwiększ efektywność i zyskaj nowych klientów.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={`${inter.className} bg-black text-white`}>{children}</body>
    </html>
  );
}

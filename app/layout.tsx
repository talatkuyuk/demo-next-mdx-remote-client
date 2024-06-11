import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navigation from "@/components/Navbar";

import "@/styles/styles.css";
import "@/styles/hljs.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Testing App for next-mdx-remote-client",
  description: "This is a blog application",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

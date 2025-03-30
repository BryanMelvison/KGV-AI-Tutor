import type { Metadata } from "next";
import { Onest } from "next/font/google";
import NavBar from "@/components/nav-bar/NavBar";
import "./globals.css";
import { SmartQuizProvider } from "@/context/SmartQuizContext";
import { SubjectDataProvider } from "@/context/SubjectDataContext";
import { AssistantChatProvider } from "@/context/AssistantChatContext";

const onest = Onest({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "KGV AI Tutor",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${onest.variable} h-full`}>
      <body className="font-onest bg-white">
        <SmartQuizProvider>
          <AssistantChatProvider>
            <SubjectDataProvider>
              <NavBar />
              <main className="flex-1 pl-20 h-full">{children}</main>
            </SubjectDataProvider>
          </AssistantChatProvider>
        </SmartQuizProvider>
      </body>
    </html>
  );
}

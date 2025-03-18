import { SmartQuizProvider } from "@/context/SmartQuizContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmartQuizProvider>{children}</SmartQuizProvider>;
}

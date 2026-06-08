import { AIChat } from "@/components/ai/ai-chat";

export const metadata = {
  title: "Mkulima AI Agronomist Assistant",

  description:
    "Get fertilizer recommendations, crop disease advice, pesticide guidance and product recommendations from Mkulima Supply AI.",
};

export default function AIPage() {
  return (
    <main className="container mx-auto py-10">
      <AIChat />
    </main>
  );
}

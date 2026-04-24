import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                {
                  role: "system",
                  content:
                    "You are SkillSwapAI's friendly language coach. Help users with grammar correction, vocabulary, phrasing, and short conversational practice. When correcting, ALWAYS show: 1) the corrected sentence in **bold**, 2) a one-line explanation, 3) optional alternative phrasings. Keep replies concise and use markdown.",
                },
                ...messages,
              ],
              stream: true,
            }),
          });

          if (response.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limited, try again soon." }), {
              status: 429,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ error: "Add credits to your Lovable workspace." }), {
              status: 402,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (!response.ok) {
            const txt = await response.text();
            console.error("AI gateway error:", response.status, txt);
            return new Response(JSON.stringify({ error: "AI gateway error" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (e) {
          console.error("ai-chat error:", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Smile } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PageHeader from "@/components/PageHeader";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

type Msg = { id: string; from: "me" | "them"; text: string; ts: string };

const EMOJIS = ["😀", "😂", "🥳", "🔥", "👍", "🙏", "💡", "❤️", "🎉", "🚀", "✨", "🤔"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", from: "them", text: "Hey! Ready to practice some Spanish? 🇪🇸", ts: "10:01" },
    { id: "2", from: "me", text: "¡Sí! Empecemos.", ts: "10:01" },
    { id: "3", from: "them", text: "Perfecto. Cuéntame sobre tu día.", ts: "10:02" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: "me", text: input, ts }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), from: "them", text: "¡Genial! Sigue así. 💪", ts },
      ]);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Chat" subtitle="WhatsApp-style messaging with your match." />

      <Card className="flex h-[70vh] flex-col overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold leading-tight">Maya Chen</div>
            <div className="text-xs text-success">● online</div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-soft px-4 py-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-soft ${
                  m.from === "me"
                    ? "rounded-br-md bg-gradient-primary text-primary-foreground"
                    : "rounded-bl-md bg-card"
                }`}
              >
                {m.text}
                <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {m.ts}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="flex items-center gap-2 border-t bg-card p-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost"><Smile className="h-5 w-5" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid grid-cols-6 gap-2 text-xl">
                {EMOJIS.map((e) => (
                  <button key={e} type="button" onClick={() => setInput((v) => v + e)} className="rounded-md p-1 hover:bg-muted">
                    {e}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message"
            className="flex-1"
          />
          <Button onClick={send} className="bg-gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
}

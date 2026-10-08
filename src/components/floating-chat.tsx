import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import { History, Plus, Trash2, X, Copy, Check, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { createThread, deleteThread, readThreads, saveMessages, type ChatThread } from "@/lib/chat-history";
import logoSrc from "@/assets/teamwork-digital-logo.jpeg";
const logo = { url: logoSrc };
import { useSiteContent } from "@/lib/site-content.functions";
import { trackEvent } from "@/lib/track";
import type { SiteContent } from "@/lib/site-content";
import { supabase } from "@/integrations/supabase/client";
import { guideReply, MENU, type Knowledge } from "@/lib/chat-guide";

export function FloatingChat() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const threadId = pathname.startsWith("/chat/") ? pathname.slice(6) : undefined;
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loadedId, setLoadedId] = useState<string>();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [storageError, setStorageError] = useState("");
  const refresh = useCallback(() => {
    try { setThreads(readThreads()); } catch { setStorageError("Chats cannot be saved in this browser. Check your browser storage settings."); }
  }, []);
  useEffect(() => {
    try {
      if (threadId) createThread(threadId);
      setThreads(readThreads());
      setLoadedId(threadId);
    } catch { setStorageError("Chats cannot be saved in this browser. Check your browser storage settings."); setLoadedId(threadId); }
  }, [threadId]);
  const openThread = (id: string) => { setHistoryOpen(false); void navigate({ to: "/chat/$threadId", params: { threadId: id } }); };
  const newChat = () => {
    try { const thread = createThread(); refresh(); openThread(thread.id); } catch { setStorageError("A new chat could not be saved. Check your browser storage settings."); }
  };
  const current = threads.find(thread => thread.id === threadId);
  const site = useSiteContent();
  const { chatbot } = site;
  if (!chatbot.enabled || /^\/(admin|login|reset-password)/.test(pathname)) return null;
  return <div className="td-chat">
    {threadId && <section className="td-chat-panel" role="dialog" aria-label="Teamwork Digital assistant" aria-modal="false">
      <header className="td-chat-header"><img src={logo.url} alt="Teamwork Digital" /><div><strong>{chatbot.name}</strong><small>{chatbot.subtitle}</small></div>
        <Button variant="ghost" size="icon" title="Chat history" aria-label="Chat history" aria-expanded={historyOpen} onClick={() => setHistoryOpen(!historyOpen)}><History /></Button>
        <Button variant="ghost" size="icon" title="New conversation" aria-label="New conversation" onClick={newChat}><Plus /></Button>
        <Button variant="ghost" size="icon" title="Close chat" aria-label="Close chat" onClick={() => { void navigate({ to: "/" }); }}><X /></Button>
      </header>
      {storageError && <p role="alert" className="td-chat-error">{storageError}</p>}
      {historyOpen ? <div className="td-chat-history"><h3>Your conversations</h3>{threads.map(thread => <div key={thread.id} className="td-chat-history-row"><Button variant={thread.id === threadId ? "secondary" : "ghost"} className="td-chat-thread" onClick={() => openThread(thread.id)}>{thread.title}</Button><Button variant="ghost" size="icon" aria-label={`Delete ${thread.title}`} title="Delete conversation" onClick={() => {
        try { deleteThread(thread.id); refresh(); if (thread.id === threadId) { const next = readThreads()[0]; if (next) openThread(next.id); else newChat(); } } catch { setStorageError("This conversation could not be deleted."); }
      }}><Trash2 /></Button></div>)}</div> : loadedId === threadId && <ChatWindow key={threadId} thread={current ?? { id: threadId, title: "New conversation", updatedAt: 0, messages: [] }} onSaved={refresh} onStorageError={setStorageError} site={site} />}
    </section>}
    {!threadId && <Button className="td-chat-launcher" title="Chat with Teamwork Assistant" aria-label="Open chat assistant" onClick={() => {
      trackEvent("chat_open");
      try { const latest = readThreads()[0]; if (latest) openThread(latest.id); else newChat(); } catch { newChat(); }
    }}><img src={logo.url} alt="" /><span className="td-chat-status" /></Button>}
    {!threadId && storageError && <p className="td-chat-launcher-error" role="alert">{storageError}</p>}
  </div>;
}

type GuideMessage = UIMessage<{ chips?: string[] }>;
let knowledgeCache: Promise<Knowledge[]> | undefined;
const loadKnowledge = () => knowledgeCache ??= Promise.resolve(supabase.from("chatbot_knowledge").select("kind, title, trigger, content").eq("enabled", true).order("sort").limit(200))
  .then(({ data }) => data ?? []).catch(() => []);

function ChatWindow({ thread, onSaved, onStorageError, site }: { thread: ChatThread; onSaved: () => void; onStorageError: (message: string) => void; site: SiteContent }) {
  const bot = site.chatbot;
  const composer = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string>();
  const [messages, setMessages] = useState<GuideMessage[]>(thread.messages as GuideMessage[]);
  const [busy, setBusy] = useState(false);
  const focus = useCallback(() => { composer.current?.querySelector("textarea")?.focus({ preventScroll: true }); }, []);
  useEffect(() => { focus(); }, [focus]);
  useEffect(() => {
    if (!messages.length) return;
    try { saveMessages(thread.id, messages as UIMessage[]); onSaved(); } catch { onStorageError("This browser could not save your conversation."); }
  }, [messages, thread.id, onStorageError, onSaved]);
  const submit = async (text: string) => {
    if (busy || !text.trim()) return;
    const user: GuideMessage = { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: text.trim() }] };
    setInput(""); setMessages(m => [...m, user]); setBusy(true);
    const knowledge = await loadKnowledge();
    await new Promise(r => setTimeout(r, 350));
    const reply = guideReply(text, site, knowledge);
    setMessages(m => [...m, { id: crypto.randomUUID(), role: "assistant", parts: [{ type: "text", text: reply.text }], metadata: { chips: reply.chips } }]);
    setBusy(false); focus();
  };
  const last = messages.at(-1);
  const chips = last?.role === "assistant" ? last.metadata?.chips ?? MENU : [];
  const starters = [...bot.suggestions.filter(Boolean), ...MENU].slice(0, 6);
  return <>
    <Conversation className="td-chat-conversation"><ConversationContent className="td-chat-messages">
      {!messages.length && <ConversationEmptyState icon={<img className="td-chat-empty-logo" src={logo.url} alt="" />} title={bot.welcomeTitle} description={bot.welcomeText}><img className="td-chat-empty-logo" src={logo.url} alt="" /><h3>{bot.welcomeTitle}</h3><p>{bot.welcomeText}</p><div className="td-chat-suggestions">{starters.map(text => <Button key={text} variant="outline" onClick={() => void submit(text)}>{text}<ArrowUp size={14} /></Button>)}</div></ConversationEmptyState>}
      {messages.map(message => <Message key={message.id} from={message.role} data-message-role={message.role}><MessageContent>{message.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i}>{part.text}</MessageResponse> : null)}</MessageContent>{message.role === "assistant" && <Button variant="ghost" size="icon-sm" title="Copy reply" aria-label="Copy reply" onClick={async () => {
        try { await navigator.clipboard.writeText(message.parts.filter(part => part.type === "text").map(part => part.text).join("\n")); setCopied(message.id); } catch { onStorageError("The reply could not be copied."); }
      }}>{copied === message.id ? <Check /> : <Copy />}</Button>}</Message>)}
      {busy && <Message from="assistant"><Shimmer>Typing…</Shimmer></Message>}
      {!busy && chips.length > 0 && <div className="td-chat-suggestions">{chips.map(text => <Button key={text} variant="outline" size="sm" onClick={() => void submit(text)}>{text}</Button>)}</div>}
    </ConversationContent><ConversationScrollButton aria-label="Scroll to latest message" /></Conversation>
    <div ref={composer} className="td-chat-composer"><PromptInput onSubmit={({ text }) => void submit(text)} maxFiles={0}>
      <PromptInputTextarea aria-label="Message Teamwork Assistant" placeholder="Ask about services, projects, pricing…" value={input} onChange={event => setInput(event.target.value)} maxLength={1000} />
      <PromptInputFooter className="justify-end"><PromptInputSubmit status={busy ? "submitted" : "ready"} disabled={busy || !input.trim()} /></PromptInputFooter>
    </PromptInput><small>Instant answers · Saved in this browser</small></div>
  </>;
}
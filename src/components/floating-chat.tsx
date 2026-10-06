import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { History, Plus, Trash2, X, Copy, Check, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { createThread, deleteThread, readThreads, saveMessages, type ChatThread } from "@/lib/chat-history";
import logo from "@/assets/teamwork-digital-logo.jpeg.asset.json";

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
  return <div className="td-chat">
    {threadId && <section className="td-chat-panel" role="dialog" aria-label="Teamwork Digital AI assistant" aria-modal="false">
      <header className="td-chat-header"><img src={logo.url} alt="Teamwork Digital" /><div><strong>Teamwork Assistant</strong><small>AI project guidance</small></div>
        <Button variant="ghost" size="icon" title="Chat history" aria-label="Chat history" aria-expanded={historyOpen} onClick={() => setHistoryOpen(!historyOpen)}><History /></Button>
        <Button variant="ghost" size="icon" title="New conversation" aria-label="New conversation" onClick={newChat}><Plus /></Button>
        <Button variant="ghost" size="icon" title="Close chat" aria-label="Close chat" onClick={() => { void navigate({ to: "/" }); }}><X /></Button>
      </header>
      {storageError && <p role="alert" className="td-chat-error">{storageError}</p>}
      {historyOpen ? <div className="td-chat-history"><h3>Your conversations</h3>{threads.map(thread => <div key={thread.id} className="td-chat-history-row"><Button variant={thread.id === threadId ? "secondary" : "ghost"} className="td-chat-thread" onClick={() => openThread(thread.id)}>{thread.title}</Button><Button variant="ghost" size="icon" aria-label={`Delete ${thread.title}`} title="Delete conversation" onClick={() => {
        try { deleteThread(thread.id); refresh(); if (thread.id === threadId) { const next = readThreads()[0]; if (next) openThread(next.id); else newChat(); } } catch { setStorageError("This conversation could not be deleted."); }
      }}><Trash2 /></Button></div>)}</div> : loadedId === threadId && <ChatWindow key={threadId} thread={current ?? { id: threadId, title: "New conversation", updatedAt: 0, messages: [] }} onSaved={refresh} onStorageError={setStorageError} />}
    </section>}
    {!threadId && <Button className="td-chat-launcher" title="Chat with Teamwork Assistant" aria-label="Open AI chatbot" onClick={() => {
      try { const latest = readThreads()[0]; if (latest) openThread(latest.id); else newChat(); } catch { newChat(); }
    }}><img src={logo.url} alt="" /><span className="td-chat-status" /></Button>}
    {!threadId && storageError && <p className="td-chat-launcher-error" role="alert">{storageError}</p>}
  </div>;
}

function ChatWindow({ thread, onSaved, onStorageError }: { thread: ChatThread; onSaved: () => void; onStorageError: (message: string) => void }) {
  const composer = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string>();
  const focus = useCallback(() => { composer.current?.querySelector("textarea")?.focus({ preventScroll: true }); }, []);
  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { conversationId: thread.id } }),
    onFinish: ({ messages: completed }) => {
      try { saveMessages(thread.id, completed); onSaved(); } catch { onStorageError("Your reply arrived, but this browser could not save it."); }
      focus();
    },
    onError: () => { focus(); },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => { focus(); }, [focus]);
  useEffect(() => {
    if (!messages.length) return;
    try { saveMessages(thread.id, messages); } catch { onStorageError("This browser could not save your conversation."); }
  }, [messages, thread.id, onStorageError]);
  const submit = (text: string) => {
    if (busy || !text.trim()) return;
    clearError(); setInput(""); void sendMessage({ text: text.trim() }); focus();
  };
  const last = messages.at(-1);
  const hasAnswer = last?.role === "assistant" && last.parts.some(part => part.type === "text" && part.text.trim());
  return <>
    <Conversation className="td-chat-conversation"><ConversationContent className="td-chat-messages">
      {!messages.length && <ConversationEmptyState icon={<img className="td-chat-empty-logo" src={logo.url} alt="" />} title="What are you building?" description="Tell me about your idea."><img className="td-chat-empty-logo" src={logo.url} alt="" /><h3>What are you building?</h3><p>Tell me about your idea.</p><div className="td-chat-suggestions">{["I need a mobile app", "Help me choose a website platform", "Can AI automate my business?"].map(text => <Button key={text} variant="outline" onClick={() => submit(text)}>{text}<ArrowUp size={14} /></Button>)}</div></ConversationEmptyState>}
      {messages.map(message => <Message key={message.id} from={message.role} data-message-role={message.role}><MessageContent>{message.parts.map((part, i) => {
        if (part.type === "text") return <MessageResponse key={i}>{part.text}</MessageResponse>;
        if (part.type === "reasoning" && part.text) return <Reasoning key={i} defaultOpen={false} isStreaming={busy && message === last}><ReasoningTrigger /><ReasoningContent>{part.text}</ReasoningContent></Reasoning>;
        return null;
      })}</MessageContent>{message.role === "assistant" && message.parts.some(part => part.type === "text") && <Button variant="ghost" size="icon-sm" title="Copy reply" aria-label="Copy reply" onClick={async () => {
        try { await navigator.clipboard.writeText(message.parts.filter(part => part.type === "text").map(part => part.text).join("\n")); setCopied(message.id); } catch { onStorageError("The reply could not be copied."); }
      }}>{copied === message.id ? <Check /> : <Copy />}</Button>}</Message>)}
      {busy && !hasAnswer && <Message from="assistant"><Shimmer>Thinking…</Shimmer></Message>}
    </ConversationContent><ConversationScrollButton aria-label="Scroll to latest message" /></Conversation>
    {error && <p role="alert" className="td-chat-error">{error.message}</p>}
    <div ref={composer} className="td-chat-composer"><PromptInput onSubmit={({ text }) => submit(text)} maxFiles={0}>
      <PromptInputTextarea aria-label="Message Teamwork Assistant" placeholder="Describe your project…" value={input} onChange={event => setInput(event.target.value)} maxLength={8000} onKeyDown={event => { if (busy && event.key === "Enter" && !event.shiftKey) event.preventDefault(); }} />
      <PromptInputFooter className="justify-end"><PromptInputSubmit status={status} disabled={!busy && !input.trim()} onStop={() => { void stop(); focus(); }} /></PromptInputFooter>
    </PromptInput><small>AI guidance · Saved in this browser · Not sent to our team</small></div>
  </>;
}
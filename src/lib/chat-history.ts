import type { UIMessage } from "ai";

export type ChatThread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };
const key = "teamwork-digital-chats-v1";

export function readThreads(): ChatThread[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error("Saved chats could not be read.");
  return value.filter((entry): entry is ChatThread => typeof entry?.id === "string" && typeof entry?.title === "string" && Array.isArray(entry?.messages));
}

export function writeThread(thread: ChatThread) {
  const threads = readThreads();
  const index = threads.findIndex(item => item.id === thread.id);
  if (index < 0) threads.unshift(thread); else threads[index] = thread;
  localStorage.setItem(key, JSON.stringify(threads.sort((a, b) => b.updatedAt - a.updatedAt)));
}

export function createThread(id: string = crypto.randomUUID()): ChatThread {
  const existing = readThreads().find(item => item.id === id);
  if (existing) return existing;
  const thread = { id, title: "New conversation", updatedAt: Date.now(), messages: [] };
  writeThread(thread);
  return thread;
}

export function saveMessages(id: string, messages: UIMessage[]) {
  const first = messages.find(message => message.role === "user");
  const text = first?.parts.filter(part => part.type === "text").map(part => part.text).join(" ");
  writeThread({ id, title: text?.slice(0, 60) || "New conversation", updatedAt: Date.now(), messages });
}

export function deleteThread(id: string) {
  localStorage.setItem(key, JSON.stringify(readThreads().filter(thread => thread.id !== id)));
}
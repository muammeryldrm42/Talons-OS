export interface MessageWindowItem {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export function trimMessageWindow(items: MessageWindowItem[], maxItems = 20) {
  return items.slice(-maxItems);
}

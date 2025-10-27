import { create } from "zustand";
import { WebSocketService } from "../services/websocket.service";

export interface ChatMessage {
  kind: string;
  content: string;
}

interface Store {
  connected: boolean;
  error: string;
  messages: Array<ChatMessage>;
  disconnect: () => void;
  send: (message: ChatMessage) => void;
}

const service = WebSocketService(
  `ws://${import.meta.env.PUBLIC_WEBSOCKET_ADDRESS}:${import.meta.env.PUBLIC_WEBSOCKET_PORT}`,
);

export const useMessageStore = create<Store>((set) => {
  service.eventHandler("open", () =>
    set({
      connected: true,
      error: "",
    }),
  );

  service.eventHandler("message", (message) =>
    set((state) => ({
      messages: [...state.messages, JSON.parse(message)],
    })),
  );

  service.eventHandler("close", () => set({ connected: false }));
  service.eventHandler("error", (error) => set({ error: error.message }));
  service.connect();

  return {
    connected: false,
    error: "",
    messages: [],
    send: (message: ChatMessage) => {
      service.send(JSON.stringify(message));
    },
    disconnect: () => {
      service.close();
      set({ connected: false, error: "", messages: [] });
    },
  };
});

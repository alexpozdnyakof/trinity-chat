import { create } from "zustand";
import { WebSocketService } from "../services/websocket.service";

export interface User {
  id: string;
  name: string;
}

type IncomeMessage =
  | {
    type: "Text";
    user_id: string;
    name: string;
    content: string;
    timestamp: string;
  }
  | { type: "Hello"; users: Array<User>; content: string; timestamp: string }
  | { type: "Help"; content: string; timestamp: string }
  | { type: "Joined"; user_id: string; name: string; timestamp: string }
  | {
    type: "ChangedName";
    user_id: string;
    prev: string;
    current: string;
    timestamp: string;
  }
  | { type: "Left"; user_id: string; name: string; timestamp: string };

interface Store {
  connected: boolean;
  error: string;

  messages: Array<ChatMessage>;
  users: Array<User>;
  disconnect: () => void;
  send: (message: Pick<ChatMessage, "content">) => void;
}

export type ChatMessage = {
  content: string;
  time: string;
  user_id: string;
  name: string;
};

function userMessage({
  content,
  timestamp,
  name,
  user_id,
}: {
  content: string;
  timestamp: string;
  name: string;
  user_id: string;
}): ChatMessage {
  const date = new Date(timestamp);
  return {
    user_id,
    name,
    content,
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function serverMessage(content: string, utc: string): ChatMessage {
  const date = new Date(utc);
  return {
    user_id: "0",
    name: "Server",
    content,
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function parseMessage(message: IncomeMessage): ChatMessage {
  switch (message.type) {
    case "Text":
      return userMessage(message);
    case "Hello":
      return serverMessage(message.content, message.timestamp);

    case "Help":
      return serverMessage(message.content, message.timestamp);
    case "Joined": {
      const text = `${message.name} вошёл в комнату`;
      return serverMessage(text, message.timestamp);
    }
    case "ChangedName": {
      const text = `${message.prev} теперь ${message.current}`;
      return serverMessage(text, message.timestamp);
    }
    case "Left": {
      const text = `${message.name} покинул  комнату`;
      return serverMessage(text, message.timestamp);
    }
    default: {
      throw new Error("Unknown message type");
    }
  }
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

  service.eventHandler("message", (raw) => {
    const message = JSON.parse(raw);
    set((state) => ({
      users:
        message.type === "Hello" && message.users.length > 0
          ? state.users.concat(message.users)
          : state.users,
      messages: state.messages.concat(parseMessage(message)),
    }));
  });

  service.eventHandler("close", () => set({ connected: false }));
  service.eventHandler("error", (error) => set({ error: error.message }));
  service.connect();

  return {
    connected: false,
    error: "",
    messages: [],
    users: [],
    send: (message: Pick<ChatMessage, "content">) => {
      service.send(JSON.stringify(message));
    },
    disconnect: () => {
      service.close();
      set({ connected: false, error: "", messages: [] });
    },
  };
});

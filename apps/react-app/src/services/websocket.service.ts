interface WebSocketService { }

interface Options {
  maxReconnect?: number;
  baseDelay?: number;
}
interface Handlers {
  open: () => void;
  close: () => void;
  message: (data: string) => void;
  error: (event: ErrorEvent) => void;
}

export function WebSocketService(
  url: `ws://${string}:${string}`,
  options: Options = {},
) {
  function noop() { }
  const { maxReconnect = 5, baseDelay = 1000 } = options;
  const buffer: Array<String> = [];
  const handlers: Handlers = {
    open: noop,
    close: noop,
    message: noop,
    error: noop,
  };

  let client: WebSocket | null = null;
  let attempts = 0;

  const isClientOpen = () => client?.readyState === WebSocket.OPEN;
  const isClientClosed = () => client?.readyState === WebSocket.CLOSED;

  function connect() {
    client = new WebSocket(url);

    client.onopen = function() {
      attempts = 0;
      handlers.open();
      processBuffer();
    };

    client.onmessage = function(event) {
      handlers.message(event.data);
    };

    client.onclose = function() {
      handlers.close();
      reconnect();
    };

    client.onerror = function(event) {
      handlers.error(event as ErrorEvent);
    };
  }

  function reconnect() {
    if (isClientClosed() || client !== null) return;

    if (maxReconnect > attempts) {
      const delay = baseDelay * Math.pow(2, attempts);
      setTimeout(() => {
        attempts++;
        console.log(
          "[WebSocketService]: reconnect ",
          attempts,
          "/",
          maxReconnect,
        );
        connect();
      }, delay);
    } else {
      console.error("[WebSocketService]: max reconnects has been reached");
    }
  }

  function send(data: string) {
    if (isClientOpen()) {
      client?.send(data);
    } else {
      buffer.push(data);
      console.warn(
        "[WebSocketService] connection is closed, outcoming message is buffered",
      );
      reconnect();
    }
  }

  function processBuffer() {
    let i = 0;
    let bufferLen = buffer.length;
    while (buffer.length > 0 && isClientOpen()) {
      const message = buffer.shift();
      if (typeof message === "string") {
        client?.send(message);
      }
      console.log(
        "[WebSocketService]: sent pending message",
        i,
        "/",
        bufferLen,
      );
    }
  }

  function close() {
    if (client) {
      client.close();
      client = null;
    } else {
      console.error("[WebSocketService]: already closed");
    }
  }

  return Object.freeze({
    connect,
    send,
    close,
    eventHandler<T extends keyof Handlers>(eventName: T, handler: Handlers[T]) {
      handlers[eventName] = handler;
    },
  });
}

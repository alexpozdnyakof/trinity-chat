import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  rstest,
} from "@rstest/core";
import { WebSocket, Server } from "mock-socket";
import { WebSocketService } from "./websocket.service";
window.WebSocket = WebSocket;
describe("WebSocketService", () => {
  const url = "ws://localhost:9393";
  let server: Server | null = null;
  let client: ReturnType<typeof WebSocketService> | null = null;

  beforeEach(() => {
    server = new Server(url);
    client = WebSocketService(url);
  });

  afterEach(() => {
    server?.close() && (server = null);
    client?.close() && (client = null);
  });
  const wait = () =>
    new Promise((resolve) => setTimeout(() => resolve(true), 100));

  it("should call open callback when succesfully connected", async () => {
    const open = rstest.fn();
    client?.eventHandler("open", open);
    client?.connect();
    await wait();
    expect(open).toHaveBeenCalled();
  });

  it("should call close callback when connection closed", async () => {
    const close = rstest.fn();
    client?.eventHandler("close", close);
    client?.connect();
    server?.close();

    await wait();
    expect(close).toHaveBeenCalled();
  });

  it("should call error callback when server has error", async () => {
    const error = rstest.fn();
    client?.eventHandler("error", error);
    server?.close();
    client?.connect();
    await wait();
    expect(error).toHaveBeenCalled();
  });

  it("should call message callback when server sent message", async () => {
    const message = rstest.fn();
    client?.eventHandler("message", message);
    client?.connect();

    server?.on("connection", (socket) => {
      socket.send("income");
    });
    await wait();
    expect(message).toHaveBeenCalledWith("income");
  });
});

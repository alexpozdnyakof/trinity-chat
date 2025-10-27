import { UserList } from "./user-list";
import { MessagesList } from "./messages-list";
import { users } from "./data";
import { Layout } from "./layout";
import { Panel } from "./panel";
import { MessageForm } from "./message-form";
import type { MessageFormValue } from "./message-form";
import { useEffect } from "react";
import { useMessageStore } from "../store/messages.store";

export function ChatRoom() {
  const { disconnect, messages, send } = useMessageStore();

  const addMessage = (formValue: MessageFormValue) => {
    send({ kind: "request", content: formValue.message });
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <Layout>
      <Panel>
        <MessagesList messages={messages}></MessagesList>
      </Panel>
      <Panel>
        <UserList users={users} />
      </Panel>
      <MessageForm onSubmit={addMessage} />
    </Layout>
  );
}

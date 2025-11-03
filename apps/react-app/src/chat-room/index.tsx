import { UserList } from "./user-list";
import { MessagesList } from "./messages-list";
import { Layout } from "./layout";
import { Panel } from "./panel";
import { MessageForm } from "./message-form";
import type { MessageFormValue } from "./message-form";
import { useEffect } from "react";
import { useMessageStore } from "../store/messages.store";

export function ChatRoom() {
  const { disconnect, messages, users, send } = useMessageStore();

  const addMessage = (formValue: MessageFormValue) => {
    send({ content: formValue.message });
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

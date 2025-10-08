import { UserList } from "./user-list";
import { MessagesList } from "./messages-list";
import { users, messages } from "./data";
import { Layout } from "./layout";
import { Panel } from "./panel";
import { MessageForm } from "./message-form";
import type { MessageFormValue } from "./message-form";

export function ChatRoom() {
  const addMessage = (formValue: MessageFormValue) => {
    console.log({ formValue });
  };
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

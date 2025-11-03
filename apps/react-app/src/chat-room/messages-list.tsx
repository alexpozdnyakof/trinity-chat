import styles from "./messages-list.module.css";
import type { ChatMessage } from "../store/messages.store";

type Props = {
  messages: Array<ChatMessage>;
};

export function MessagesList({ messages }: Props) {
  return (
    <div className={styles["flex-vertical"]}>
      {messages.map((message) => (
        <div className={styles.message}>
          <time>
            <b>[{message.time}]</b>
          </time>
          <span>
            <b>{message.name}:</b>
          </span>
          <span>
            <pre>{message.content}</pre>
          </span>
        </div>
      ))}
    </div>
  );
}

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
            <b>[19:23:31]</b>
          </time>
          <span>
            <b>Subzero:</b>
          </span>
          <span>{message.content}</span>
        </div>
      ))}
    </div>
  );
}

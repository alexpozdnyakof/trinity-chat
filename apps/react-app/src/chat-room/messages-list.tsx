import styles from "./messages-list.module.css";
import type { Message } from "./message";

type Props = {
  messages: Array<Message>;
};

export function MessagesList({ messages }: Props) {
  return (
    <div className={styles["flex-vertical"]}>
      {messages.map((message) => (
        <div className={styles.message}>
          <time>
            <b>[{message.date}]</b>
          </time>
          <span>
            <b>{message.author.name}:</b>
          </span>
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  );
}

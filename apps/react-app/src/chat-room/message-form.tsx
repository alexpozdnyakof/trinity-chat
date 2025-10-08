import styles from "./message-form.module.css";
import type { FormEvent } from "react";
import { useState } from "react";

export type MessageFormValue = {
  message: string;
};

export function MessageForm({
  onSubmit,
}: {
  onSubmit: (formValue: MessageFormValue) => void;
}) {
  const [value, setValue] = useState<string>("");

  const wrapSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ message: value });
    setValue("");
  };

  return (
    <form onSubmit={wrapSubmit} className={styles["message-form"]}>
      <input
        autoFocus
        value={value}
        className={styles["message-field"]}
        id="message"
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
      />
      <input type="submit" hidden />
    </form>
  );
}

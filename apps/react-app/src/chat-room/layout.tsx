import type { PropsWithChildren } from "react";
import styles from "./layout.module.css";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>{children}</div>
    </div>
  );
}

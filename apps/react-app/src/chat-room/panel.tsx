import type { PropsWithChildren } from "react";
import styles from "./panel.module.css";

export function Panel({ children }: PropsWithChildren) {
  return <div className={styles.panel}>{children}</div>;
}

import styles from "./user-list.module.css";
import type { User } from "../store/messages.store.ts";

type Props = {
  users: Array<User>;
};

export function UserList({ users }: Props) {
  return (
    <ul className={styles["user-list"]}>
      {users.map((user: User) => (
        <li>
          <a href="/users/id"> {user.name}</a>
        </li>
      ))}
    </ul>
  );
}

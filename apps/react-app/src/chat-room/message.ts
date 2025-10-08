import type { User } from "./user";

export type Message = {
  author: User;
  text: string;
  date: string;
};

export type Message = {
  author: User;
  text: string;
  date: string;
};
export type User = {
  id: number;
  name: string;
};

export const users: Array<User> = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  name: "subzero_303",
}));

export const messages: Array<Message> = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  text: hash("JS simple hash function"),
  author: { id: i, name: "subzero_303" },
  date: new Date().toLocaleTimeString("ru-RU"),
}));

function hash(s: string) {
  var a = 1,
    c = 0,
    h,
    o;
  if (s) {
    a = 0;
    for (h = s.length - 1; h >= 0; h--) {
      o = s.charCodeAt(h);
      a = ((a << 6) & 268435455) + o + (o << 14);
      c = a & 266338304;
      a = c !== 0 ? a ^ (c >> 21) : a;
    }
  }
  return String(a);
}

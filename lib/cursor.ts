/**
 * What a link or button does, as marked on it with data-cursor="…", for the circle cursor
 * (components/chrome/LinkCursor.tsx). The words for each are in messages/*.json under "cursor".
 */
export const CURSOR_KEYS = ["talk", "view", "read", "open", "go", "copy", "copied", "mail", "menu", "close", "try", "stop", "play", "pause", "up"] as const;
export type CursorKey = (typeof CURSOR_KEYS)[number];
export type CursorLabels = Record<CursorKey, string>;

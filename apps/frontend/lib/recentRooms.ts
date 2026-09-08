const STORAGE_KEY = "handydraw-recent-rooms";
const MAX_RECENT = 5;

export function getRecentRooms(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentRoom(name: string) {
  if (typeof window === "undefined") return;
  const current = getRecentRooms().filter((r) => r !== name);
  const updated = [name, ...current].slice(0, MAX_RECENT);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
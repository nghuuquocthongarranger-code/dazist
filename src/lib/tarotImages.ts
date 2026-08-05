const modules = import.meta.glob<{ default: string }>("../assets/tarot/*.png", { eager: true });

export const TAROT_IMAGES: Record<string, string> = {};
for (const path in modules) {
  const id = path.split("/").pop()!.replace(".png", "");
  TAROT_IMAGES[id] = modules[path].default;
}

export function getCardImage(id: string): string | undefined {
  return TAROT_IMAGES[id];
}

import { getLevels } from "@/lib/levels/getLevels";
import { Level } from "@/types/level";

export function getLevelById(levelId: string): Level | null {
  const level = getLevels().find((entry) => entry.id === levelId);
  return level ?? null;
}

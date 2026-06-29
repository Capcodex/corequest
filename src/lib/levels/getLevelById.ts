import { getContentEntryById } from "@/lib/content/getCurriculum";
import { Level } from "@/types/level";

export function getLevelById(levelId: string): Level | null {
  const level = getContentEntryById(levelId);
  return level?.type === "exercise" ? level : null;
}
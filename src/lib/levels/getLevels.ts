import { getExerciseEntries } from "@/lib/content/getCurriculum";
import { Level } from "@/types/level";

export function getLevels(): Level[] {
  return getExerciseEntries();
}
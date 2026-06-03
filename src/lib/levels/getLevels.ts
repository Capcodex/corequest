import levels from "@/data/rust-foundations/levels.json";
import { Level } from "@/types/level";

export function getLevels(): Level[] {
  return [...(levels as Level[])].sort((left, right) => left.orderIndex - right.orderIndex);
}

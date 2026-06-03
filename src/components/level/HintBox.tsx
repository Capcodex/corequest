import { Alert } from "@/components/ui/Alert";

type HintBoxProps = {
  hint: string;
};

export function HintBox({ hint }: HintBoxProps) {
  return (
    <Alert tone="info">
      <span className="font-semibold">Indice :</span> {hint}
    </Alert>
  );
}

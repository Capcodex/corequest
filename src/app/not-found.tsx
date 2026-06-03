import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
      <Card className="w-full space-y-4 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Navigation perdue</p>
        <h1 className="text-3xl font-semibold text-foreground">Cette page n'existe pas.</h1>
        <p className="text-base text-muted">
          Revenons au parcours principal pour continuer la reconstruction du noyau.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ProductPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <Card className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Aperçu MVP</p>
          <h2 className="text-3xl font-semibold text-foreground">
            Un niveau rassemble mission, cours, exercice, code et validation.
          </h2>
          <p className="text-base leading-8 text-muted">
            Le MVP doit tester la boucle complète, pas seulement une page marketing :
            on prépare déjà la page de niveau, l&apos;éditeur et le branchement sandbox.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-panelAlt p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Prêt à entrer ?</p>
          <p className="mt-4 text-sm leading-7 text-muted">
            Le niveau 1 reste accessible sans compte pour démarrer vite.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/levels/rust-level-1">Lancer le niveau 1</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

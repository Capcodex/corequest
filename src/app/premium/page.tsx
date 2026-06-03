import { PremiumInterestForm } from "@/components/premium/PremiumInterestForm";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function PremiumPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-4 p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Premium</p>
        <h1 className="text-4xl font-semibold text-foreground">Premium bientôt disponible</h1>
        <p className="max-w-3xl text-base leading-8 text-muted">
          Le MVP ne propose pas encore de paiement. En revanche, nous préparons déjà
          l’extension du parcours avec davantage de niveaux, des arcs de progression plus riches
          et des contenus avancés.
        </p>
      </Card>
      <PremiumInterestForm
        defaultEmail={user?.email ?? null}
        isAuthenticated={Boolean(user)}
      />
    </div>
  );
}

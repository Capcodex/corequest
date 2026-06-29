import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navLinkClassName =
  "rounded-md px-1 py-1 text-sm text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-black text-slate-950">
              CQ
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted">CoreQuest</p>
              <p className="text-sm text-foreground">Apprendre Rust en pratiquant</p>
            </div>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-6 md:flex">
            {user ? (
              <>
                <Link href="/dashboard" className={navLinkClassName}>
                  Tableau de bord
                </Link>
                <Link href="/map" className={navLinkClassName}>
                  Parcours
                </Link>
                <Link href="/review" className={navLinkClassName}>
                  Révisions
                </Link>
              </>
            ) : null}
            <Link href="/onboarding" className={navLinkClassName}>
              Découvrir
            </Link>
            <Link href="/levels/rust-level-1" className={navLinkClassName}>
              Niveau 1
            </Link>
            <Link href="/premium" className={navLinkClassName}>
              Premium
            </Link>
            {user ? (
              <LogoutButton />
            ) : (
              <>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/auth/login">Connexion</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/signup">Créer un compte</Link>
                </Button>
              </>
            )}
          </nav>
        </div>

        <nav aria-label="Navigation mobile" className="flex flex-wrap items-center gap-2 md:hidden">
          {user ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/dashboard">Tableau de bord</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/map">Parcours</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/review">Révisions</Link>
              </Button>
            </>
          ) : null}
          <Button asChild size="sm" variant="ghost">
            <Link href="/onboarding">Découvrir</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/levels/rust-level-1">Niveau 1</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/premium">Premium</Link>
          </Button>
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Créer un compte</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-black text-slate-950">
            CQ
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">CoreQuest</p>
            <p className="text-sm text-foreground">Rust, niveau par niveau</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/map" className="text-sm text-muted hover:text-foreground">
                Progression
              </Link>
            </>
          ) : null}
          <Link href="/onboarding" className="text-sm text-muted hover:text-foreground">
            Onboarding
          </Link>
          <Link href="/levels/rust-level-1" className="text-sm text-muted hover:text-foreground">
            Niveau 1
          </Link>
          <Link href="/premium" className="text-sm text-muted hover:text-foreground">
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
    </header>
  );
}

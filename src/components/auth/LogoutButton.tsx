import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <form action="/auth/logout" method="post">
      <Button type="submit" size="sm" variant="secondary">
        Se déconnecter
      </Button>
    </form>
  );
}


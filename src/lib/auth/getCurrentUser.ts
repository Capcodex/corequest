import { createClient } from "@/lib/supabase/server";
import { AppUser } from "@/types/user";

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.user_metadata?.display_name ?? null,
  };
}


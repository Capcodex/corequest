import { createClient } from "@/lib/supabase/server";

type SavePremiumInterestInput = {
  email?: string | null;
  source?: string;
};

export async function savePremiumInterest({
  email = null,
  source = "premium-page",
}: SavePremiumInterestInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedEmail = user?.email ?? email;

  if (!user && !resolvedEmail) {
    throw new Error("EMAIL_REQUIRED");
  }

  const { error } = await supabase.from("premium_interest").upsert(
    {
      user_id: user?.id ?? null,
      email: resolvedEmail,
      source,
    },
    {
      onConflict: user ? "user_id" : "email",
      ignoreDuplicates: false,
    },
  );

  if (error) {
    throw error;
  }

  return {
    email: resolvedEmail ?? null,
    userId: user?.id ?? null,
  };
}


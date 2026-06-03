import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

type RequireUserOptions = {
  nextPath?: string;
};

export async function requireUser(options?: RequireUserOptions) {
  const user = await getCurrentUser();

  if (!user) {
    const nextSuffix = options?.nextPath
      ? `?next=${encodeURIComponent(options.nextPath)}`
      : "";
    redirect(`/auth/login${nextSuffix}`);
  }

  return user;
}


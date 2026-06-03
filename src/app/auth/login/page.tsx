import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="px-4 py-10">
      <AuthForm mode="login" />
    </div>
  );
}


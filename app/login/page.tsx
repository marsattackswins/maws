import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { serverConfig } from "@/lib/server/env/config";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  let localMode = false;
  try {
    localMode = serverConfig().env === "local";
  } catch {
    // Keep the existing fail-closed login surface if configuration is invalid.
  }

  if (localMode) redirect("/");
  return <LoginForm />;
}

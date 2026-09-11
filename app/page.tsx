import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isOperatorPageAuthorized } from "@/lib/server/auth/page-guard";
import { AppShell } from "@/components/shell/AppShell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  // Server-side authorization check, same pattern as /admin:
  // local → anonymous allowed; non-local → session required.
  // Throws on config error (fail closed), redirects to /login when unauthorized.
  try {
    const authorized = isOperatorPageAuthorized(cookieHeader);
    if (!authorized) {
      redirect("/login");
    }
  } catch {
    // Configuration load failure: fail closed, do not render the terminal.
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
        <div className="max-w-md text-center">
          <div className="mb-4 text-lg text-[#f23645]">Service Unavailable</div>
          <div className="text-sm text-[#787b86]">
            The terminal is temporarily unavailable. Please contact support if this persists.
          </div>
        </div>
      </div>
    );
  }

  return <AppShell />;
}

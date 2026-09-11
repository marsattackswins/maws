import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isOperatorPageAuthorized } from "@/lib/server/auth/page-guard";
import StatusPage from "./StatusPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  // Server-side authorization check:
  // local → anonymous allowed; non-local → session required.
  try {
    const authorized = isOperatorPageAuthorized(cookieHeader);
    if (!authorized) {
      redirect("/login");
    }
  } catch {
    // Configuration load failure: fail closed, do not render the status page.
    return (
      <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-4 text-lg text-[#f23645]">Service Unavailable</div>
          <div className="text-sm text-[#787b86]">
            The status page is temporarily unavailable. Please contact support if this persists.
          </div>
        </div>
      </div>
    );
  }

  return <StatusPage />;
}

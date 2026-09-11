import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isOperatorPageAuthorized } from "@/lib/server/auth/page-guard";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  // Server-side authorization check
  // Throws on config error (fail closed), returns false if unauthorized
  try {
    const authorized = isOperatorPageAuthorized(cookieHeader);
    if (!authorized) {
      redirect("/login");
    }
  } catch {
    // Configuration load failure: fail closed, do not render admin content
    // Return generic error page without sensitive information
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
        <div className="max-w-md text-center">
          <div className="text-[#f23645] mb-4 text-lg">Service Unavailable</div>
          <div className="text-[#787b86] text-sm">
            The admin dashboard is temporarily unavailable. Please contact support if this persists.
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

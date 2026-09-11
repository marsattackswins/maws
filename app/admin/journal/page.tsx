import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isOperatorPageAuthorized } from "@/lib/server/auth/page-guard";
import TradeJournalPage from "./TradeJournalPage";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  try {
    const authorized = isOperatorPageAuthorized(cookieHeader);
    if (!authorized) {
      redirect("/login");
    }
  } catch {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
        <div className="max-w-md text-center">
          <div className="mb-4 text-lg text-[#f23645]">Service Unavailable</div>
          <div className="text-sm text-[#787b86]">
            The trade journal is temporarily unavailable. Please contact support if this persists.
          </div>
        </div>
      </div>
    );
  }

  return <TradeJournalPage />;
}

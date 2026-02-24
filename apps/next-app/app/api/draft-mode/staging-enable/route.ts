import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Staging-only route that auto-enables Next.js draft mode so the app fetches
// draft content via `perspective: 'drafts'` without requiring a Studio session.
// Gated by SANITY_IS_STAGING so it is a no-op on production builds.
export async function GET(request: Request) {
  if (!process.env.SANITY_IS_STAGING) {
    return new Response("Not found", { status: 404 });
  }

  (await draftMode()).enable();

  const { searchParams } = new URL(request.url);
  redirect(searchParams.get("returnTo") ?? "/");
}

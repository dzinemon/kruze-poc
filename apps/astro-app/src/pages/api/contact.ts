import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";

  let data: Record<string, string>;

  if (contentType.includes("application/json")) {
    data = await request.json();
  } else {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries()) as Record<string, string>;
  }

  const { name, email, message } = data;

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Name, email, and message are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // TODO: Replace with actual form handling (email service, database, etc.)

  return new Response(
    JSON.stringify({ success: true, message: "Form submitted successfully." }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};

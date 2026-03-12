import type { APIRoute } from "astro";

export const prerender = false;

export const get: APIRoute = async ({ cookies }) => {
  const token = cookies.get("session_id")?.value;
  if (!token) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const API_BASE = import.meta.env.PUBLIC_API_BASE ?? "http://localhost:3010";

  // Llamada al backend con la cookie
  const res = await fetch(`${API_BASE}/auth/session`, {
    headers: { cookie: `session_id=${token}` },
  });

  const data = await res.json().catch(() => null);

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};

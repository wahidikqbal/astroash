import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiBaseUrl = import.meta.env.ASH_API_URL || 'http://localhost:4000';
    const mePath = import.meta.env.ASH_ME_PATH || 'api/me';
    const externalUrl = new URL(mePath.replace(/^\//, ''), apiBaseUrl).toString();

    const res = await fetch(externalUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/vnd.api+json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

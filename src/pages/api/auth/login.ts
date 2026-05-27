import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body;

  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch (e) {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/vnd.api+json' },
    });
  }

  try {
    const apiBaseUrl = import.meta.env.ASH_API_URL || 'http://localhost:4000';
    const loginPath = import.meta.env.ASH_LOGIN_PATH || 'api/login';
    const externalUrl = new URL(loginPath.replace(/^\//, ''), apiBaseUrl).toString();

    const res = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/vnd.api+json' },
      });
    }

    // Simpan token di HttpOnly cookie
    cookies.set('token', data.meta.token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/',
    });

    // Return user info tanpa token
    return new Response(JSON.stringify({
      user: {
        id: data.data.id,
        email: data.data.attributes.email,
      }
    }), {
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
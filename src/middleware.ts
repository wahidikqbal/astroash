import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const tokenCookie = cookies.get('token');
  const hasToken = !!tokenCookie?.value;
  
  const pathname = new URL(url).pathname;
  
  // Routes yang tidak memerlukan auth
  const publicRoutes = ['/auth/login', '/api/login'];
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));
  
  // Routes yang hanya bisa diakses oleh guest (belum login)
  const guestOnlyRoutes = ['/auth/login'];
  const isGuestOnly = guestOnlyRoutes.includes(pathname);
  
  // Redirect ke login jika belum login dan mengakses halaman terproteksi
  if (!hasToken && !isPublic) {
    return redirect('/auth/login', 302);
  }
  
  // Redirect ke /auth/me jika sudah login dan mengakses halaman guest-only
  if (hasToken && isGuestOnly) {
    return redirect('/auth/me', 302);
  }
  
  return next();
});
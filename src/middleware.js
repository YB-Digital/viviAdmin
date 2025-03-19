import { NextResponse } from 'next/server';

export function middleware(request) {
  // Extract adminId from cookies
  const adminId = request.cookies.get('adminId');
  const { pathname } = request.nextUrl; // URL info

  // If adminId is missing and trying to access admin routes or restricted pages
  if (!adminId && pathname !== '/login' && pathname !== '/') {
    const redirectUrl = request.nextUrl.clone();
    
    // Redirect to login page if adminId is missing
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Allow access if adminId exists or the path is permitted
  return NextResponse.next();
}

// Apply middleware to routes starting with /admin or other restricted paths
export const config = {
  matcher: ['/:path*', '/', '/restricted', '/restricted/*'], // Adjust paths as needed
};

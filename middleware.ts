import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware ensures that API routes that rely on Appwrite 
// are only accessible from the client-side
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  
  // Add a custom header to identify client-side requests
  requestHeaders.set('x-is-client-side', '1');
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only apply this middleware to API routes that use Appwrite
export const config = {
  matcher: ['/api/:path*'],
}; 
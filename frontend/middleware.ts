import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware disabled — auth is handled at the page level via getMe()
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

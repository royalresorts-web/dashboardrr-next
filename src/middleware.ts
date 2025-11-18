import type { NextRequest } from 'next/server'; // Import the type for NextRequest
import { NextResponse } from "next/server";

export function middleware(request: NextRequest){
    const url = request.nextUrl;


    // Redirect from `/` to `/dashboard`
    if (url.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
}

export const config = {
  matcher: [
//         /*
//      * Match all request paths EXCEPT for the ones starting with:
//      * - /api (API routes)
//      * - /_next/static (Next.js static files)
//      * - /_next/image (Next.js image optimization files)
//      * - /favicon.ico, /sitemap.xml, /robots.txt (common static assets)
//      * - /public_assets (a custom folder you want to exclude)
//      * - /login (your login page)
//      * - /register (your registration page)
//      */
        '/((?!api/|_next/static/|_next/image(?:$|/)|images/|public_assets/|translates/|.well-known/|register(?:$|/)|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$|.*\\.(?:avif|bmp|cur|gif|ico|jfif|jpeg|jpg|pjpeg|pjp|png|svg|tif|tiff|webp|css|js|mjs|json|webmanifest|xml|txt|eot|otf|ttf|woff|woff2|mp3|mp4|ogg|webm|pdf)$).*)'
  ],
}
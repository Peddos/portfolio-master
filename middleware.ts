import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/).*)',
    ],
};

export async function middleware(req: NextRequest) {
    // Refresh auth session
    let response = await updateSession(req);

    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

    // Strip port for comparison
    const currentHost = hostname.replace(`:${url.port}`, '');
    const rootHost = rootDomain.replace(/:.*$/, '');

    // Detect subdomain
    const subdomain = currentHost.replace(`.${rootHost}`, '');

    // 1. Handle Protected Routes (Auth required for /intake and /admin)
    const isProtected = ['/intake', '/admin'].some(path => url.pathname.startsWith(path));
    if (isProtected) {
        // We check for the cookie manually if we can't easily get the user in middleware
        // Better: updateSession already checked getUser. We can check if it returned a response indicating no session
        // For simplicity in this demo, let's look for the session cookie
        const hasSession = req.cookies.getAll().some(c => c.name.includes('supabase-auth-token') || c.name.includes('sb-'));
        if (!hasSession) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // 2. Handle Subdomains
    if (
        subdomain &&
        subdomain !== currentHost &&
        subdomain !== 'www' &&
        !subdomain.startsWith('_')
    ) {
        url.pathname = `/portfolio/${subdomain}`;
        return NextResponse.rewrite(url);
    }

    return response;
}

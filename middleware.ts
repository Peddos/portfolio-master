import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/).*)',
    ],
};

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

    // Strip port for comparison
    const currentHost = hostname.replace(`:${url.port}`, '');
    const rootHost = rootDomain.replace(/:.*$/, '');

    // Detect subdomain (e.g. jane.localhost or jane.portfolio-engine.com)
    const subdomain = currentHost.replace(`.${rootHost}`, '');

    if (
        subdomain &&
        subdomain !== currentHost &&   // means there IS a subdomain prefix
        subdomain !== 'www' &&
        !subdomain.startsWith('_')
    ) {
        // Internally rewrite to /portfolio/[subdomain]
        url.pathname = `/portfolio/${subdomain}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

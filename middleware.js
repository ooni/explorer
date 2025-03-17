import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/m/:path*', '/measurement/:path*'],
  has: [
    { type: 'header', key: 'enable-embedded-view' },
    { type: 'header', key: 'accept-language' },
  ],
}

export function middleware(request) {
  const lang = request.headers.get('accept-language')
  const fallbackLang = request.headers.get('accept-language').split('-')[0]
  if (process.env.LOCALES.includes(lang)) {
    return NextResponse.rewrite(
      new URL(`/${lang}${request.nextUrl.pathname}`, request.url),
    )
  }
  if (process.env.LOCALES.includes(fallbackLang)) {
    return NextResponse.rewrite(
      new URL(`/${fallbackLang}${request.nextUrl.pathname}`, request.url),
    )
  }
}

import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/m/:path*', '/measurement/:path*'],
  has: [
    { type: 'header', key: 'enable-embedded-view' },
    // { type: 'header', key: 'accept-language' },
  ],
}

const locales = JSON.parse(process.env.LOCALES || '["en"]')

export function proxy(request) {
  if (
    request.headers.get('accept-language') &&
    request.headers.get('enable-embedded-view')
  ) {
    const lang = request.headers.get('accept-language')
    if (locales.includes(lang)) {
      return NextResponse.rewrite(
        new URL(
          `/${lang}${request.nextUrl.pathname}${request.nextUrl.search}`,
          request.url,
        ),
      )
    }
    const fallbackLang = request.headers.get('accept-language').split('-')[0]
    if (locales.includes(fallbackLang)) {
      return NextResponse.rewrite(
        new URL(
          `/${fallbackLang}${request.nextUrl.pathname}${request.nextUrl.search}`,
          request.url,
        ),
      )
    }
  }
}

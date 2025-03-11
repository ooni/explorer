import { NextResponse } from 'next/server'

export function middleware(request) {
  if (
    request.nextUrl.pathname.startsWith('/m/') &&
    request.headers.get('enable-embedded-view') &&
    request.headers.get('accept-language')
  ) {
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
}

import createProxy from 'next-intl/middleware';

export default createProxy({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

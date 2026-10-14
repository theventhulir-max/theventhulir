export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theventhulir.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/home',
          '/images/*',
          '/assets/*',
          '/uploads/*',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin/*',
          '/checkout',
          '/cart',
          '/account',
          '/forgot-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

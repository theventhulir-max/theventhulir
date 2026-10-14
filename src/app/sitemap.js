import productsData from '@/data/products.json';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theventhulir.com';
  const currentDate = new Date().toISOString();

  // Core Static Routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Category specific search landing URLs for maximum SEO crawling
    {
      url: `${baseUrl}/products?category=Masala+Blends`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/products?category=Spices+%26+Powders`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/products?category=Cold-Pressed+Oils`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/products?category=Single+Origin+Spices`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/products?category=Heritage+Masalas`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // Dynamic Product Pages
  const productRoutes = (productsData || []).map((product) => {
    const id = product.id || product._id;
    return {
      url: `${baseUrl}/products/${id}`,
      lastModified: product.updatedAt || product.createdAt || currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    };
  });

  return [...staticRoutes, ...productRoutes];
}

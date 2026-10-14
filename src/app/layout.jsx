import './globals.css';
import Providers from '@/components/Providers';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theventhulir.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Venthulir — Official Store | Venthulir Masala & Wood Cold-Pressed Oils',
    template: '%s | Venthulir',
  },
  description:
    'Official Venthulir Store. Buy 100% authentic pure Venthulir Masala powders (Sambar, Garam, Chilli, Turmeric, Coriander) and traditional Vaagai Mara Chekku cold-pressed oils direct from Salem & Namakkal, Tamil Nadu.',
  keywords: [
    'venthulir',
    'venthulir masala',
    'the venthulir',
    'theventhulir',
    'theventhulir.com',
    'venthulir official',
    'venthulir site',
    'venthulir store',
    'venthulir online',
    'venthulir natural harvests',
    'venthulir spices',
    'venthulir oil',
    'venthulir cold pressed oil',
    'venthulir salem',
    'venthulir namakkal',
    'venthulir tamil nadu',
    'வெண்துளிர்',
    'வெண்துளிர் மசாலா',
    'வெண்துளிர் மரச்செக்கு எண்ணெய்',
    'best masala in salem',
    'best masala powder in namakkal',
    'best masala in tamil nadu',
    'buy masala powder online salem',
    'organic spices namakkal',
    'traditional sambar masala salem',
    'chettinad masala powder online',
    'authentic rasam powder tamil nadu',
    'royal garam masala blend',
    'salem pure turmeric powder high curcumin',
    'stone ground coriander powder namakkal',
    'guntur chilli powder buy online tamil nadu',
    'mara chekku oil salem',
    'wood cold pressed groundnut oil namakkal',
    'pure sesame gingelly oil tamil nadu',
    'virgin coconut oil cold pressed',
    'homemade masala powders tamil nadu'
  ].join(', '),
  authors: [{ name: 'Venthulir', url: siteUrl }],
  creator: 'Venthulir',
  publisher: 'Venthulir Natural Harvests',
  applicationName: 'Venthulir',
  category: 'Food & Beverage / Organic Produce & Spices',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Venthulir — Official Store | Venthulir Masala & Wood Cold-Pressed Oils',
    description:
      'Official Venthulir Store. 100% pure authentic Venthulir Masala and Vaagai Mara Chekku cold-pressed oils direct from Salem, Namakkal, and Tamil Nadu heritage farms.',
    url: siteUrl,
    siteName: 'Venthulir',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/hero-full-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Venthulir Official — Pure Masalas and Cold Pressed Oils in Tamil Nadu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venthulir — Official Store | Venthulir Masala & Oils',
    description:
      'Official site of Venthulir Natural Harvests. Farm-fresh single-origin masalas, sambar powder, cold-pressed oils & pure honey.',
    images: ['/hero-full-banner.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  // Brand & Organization Schema for Top Google Entity Ranking
  const brandOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Venthulir',
    legalName: 'Venthulir Natural Harvests',
    alternateName: [
      'Venthulir Masala',
      'The Venthulir',
      'theventhulir',
      'theventhulir.com',
      'Venthulir Organics',
      'Venthulir Spices',
      'Venthulir Oils',
      'Venthulir Salem',
      'Venthulir Namakkal',
      'வெண்துளிர்',
      'வெண்துளிர் மசாலா',
    ],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${siteUrl}/hero-full-banner.jpg`,
    description:
      'Venthulir is the official authentic Tamil Nadu brand producing 100% pure Venthulir Masala blends, single-origin spices, and Vaagai wood cold-pressed oils direct from Salem and Namakkal.',
    email: 'theventhulir@gmail.com',
    telephone: '+918778476414',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Salem',
      addressRegion: 'Tamil Nadu',
      postalCode: '636001',
      addressCountry: 'IN',
    },
    brand: {
      '@type': 'Brand',
      '@id': `${siteUrl}/#brand`,
      name: 'Venthulir Masala',
      alternateName: ['Venthulir', 'The Venthulir', 'வெண்துளிர் மசாலா'],
      logo: `${siteUrl}/logo.png`,
    },
    sameAs: [
      'https://www.instagram.com/venthulir',
      'https://www.instagram.com/theventhulir',
      'https://www.facebook.com/venthulir',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+918778476414',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil'],
    },
  };

  // Schema.org Structured Data (JSON-LD) for Local Business & Masala Spices Store
  const localStoreSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${siteUrl}/#store`,
    name: 'Venthulir',
    alternateName: 'Venthulir Natural Harvests',
    description:
      'Premium single-origin spices, heirloom masala blends, and authentic Vaagai Mara Chekku cold-pressed oils serving Salem, Namakkal, Erode, Coimbatore, Chennai, and all of Tamil Nadu.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/hero-full-banner.jpg`,
    telephone: '+918778476414',
    email: 'theventhulir@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Salem',
      addressRegion: 'Tamil Nadu',
      postalCode: '636001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.6643,
      longitude: 78.146,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Salem, Tamil Nadu' },
      { '@type': 'AdministrativeArea', name: 'Namakkal, Tamil Nadu' },
      { '@type': 'AdministrativeArea', name: 'Erode, Tamil Nadu' },
      { '@type': 'AdministrativeArea', name: 'Coimbatore, Tamil Nadu' },
      { '@type': 'AdministrativeArea', name: 'Chennai, Tamil Nadu' },
      { '@type': 'AdministrativeArea', name: 'Tiruchirappalli, Tamil Nadu' },
      { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '21:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Authentic Masalas, Spices and Wood Cold-Pressed Oils',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Heritage Masala Blends',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: "Grandma's Heritage Sambar Masala Powder",
                description: 'Authentic 14-spice roasted blend for traditional Tamil Nadu sambar.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Royal Artisan Garam Masala Powder',
                description: 'Slow-roasted whole spice blend stone pulverized for rich aroma.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Single-Origin Pure Turmeric Powder',
                description: 'Naturally cultivated Salem & Erode turmeric with 5%+ curcumin.',
              },
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Mara Chekku Cold-Pressed Oils',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mara Chekku Cold-Pressed Groundnut Oil',
                description: 'Traditional wood-pressed virgin groundnut oil extracted using Vaagai wood.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mara Chekku Cold-Pressed Gingelly / Sesame Oil',
                description: 'Traditional wood-pressed gingelly oil sweetened with organic palm jaggery.',
              },
            },
          ],
        },
      ],
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Venthulir',
    alternateName: ['Venthulir Natural Harvests', 'The Venthulir', 'வெண்துளிர்'],
    description: 'Official site of Venthulir. Best Masala Powders & Wood Cold-Pressed Oils in Salem, Namakkal, Tamil Nadu',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where can I buy the best authentic masala powder in Salem and Namakkal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Venthulir provides 100% natural, stone-ground authentic masala powders (Sambar, Garam, Turmeric, Chilli, Coriander) crafted from heritage Tamil Nadu recipes and delivered fresh to Salem, Namakkal, and across Tamil Nadu.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Venthulir wood cold-pressed oils 100% pure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our oils are extracted using traditional Vaagai wood churns (Mara Chekku) below 40°C. They contain zero preservatives, no artificial coloring, and zero chemical solvents, retaining maximum vitamins and nutty fragrance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver masalas and cold-pressed oils across Salem, Namakkal, and Tamil Nadu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Venthulir ships farm-fresh harvests with express packaging across Salem, Namakkal, Erode, Coimbatore, Chennai, Trichy, and all locations in Tamil Nadu and India.',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Structured Data: Brand & Organization Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandOrganizationSchema) }}
        />
        {/* Structured Data: Local Business / Store */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localStoreSchema) }}
        />
        {/* Structured Data: Website & Search Action */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        {/* Structured Data: FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


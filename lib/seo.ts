// lib/seo.ts
import { Metadata } from 'next';

export const SITE_NAME = "Mkulima Supply Store Agrovet";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkulimasupply.store";

// ─── Blog ─────────────────────────────────────────────────────────────────────

export function generateBlogMetadata(post: any): Metadata {
  const title = post.seoTitle || `${post.title} | ${SITE_NAME}`;
  const description = post.seoDescription || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage || `${SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_KE',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function generateBlogJsonLd(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: post.seoKeywords?.join(', ') || post.tags?.join(', '),
  };
}

// ─── Product ──────────────────────────────────────────────────────────────────

export function generateProductMetadata(product: any): Metadata {
  const title = `${product.name} | Buy Online – ${SITE_NAME}`;
  const description =
    product.description
      ? `${product.description.slice(0, 155).trim()}…`
      : `Buy ${product.name} online in Kenya. Genuine agrovet-approved product. Pay via M-Pesa. Fast delivery countrywide.`;
  const url = `${SITE_URL}/product/${product.slug}`;
  const image = product.images?.[0] || `${SITE_URL}/og-default.jpg`;
  const categoryName = product.category?.name || 'Farm Inputs';

  return {
    title,
    description,
    keywords: [
      product.name,
      categoryName,
      'buy ' + product.name + ' Kenya',
      product.name + ' price Kenya',
      'agrovet Kenya',
      'farm inputs Nairobi',
      'KEPHIS certified',
      'M-Pesa',
    ].join(', '),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_KE',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function generateProductJsonLd(product: any) {
  const url = `${SITE_URL}/product/${product.slug}`;
  const image = product.images?.[0] || `${SITE_URL}/og-default.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.length > 0 ? product.images : [image],
    sku: `AGR-${product.id.slice(0, 6).toUpperCase()}`,
    brand: { "@type": "Organization", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "KES",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating?.toFixed(1),
        reviewCount: product.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Local Business (homepage) ────────────────────────────────────────────────

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-default.jpg`,
    description:
      "Buy certified seeds, fertilisers, pesticides and veterinary supplies online. Serving Kenya with quality farm inputs. Pay via M-Pesa.",
    telephone: "+254746403931",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ongata Rongai",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.3969,
      longitude: 36.7438,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '254700000000'}`,
    ],
    priceRange: "KES",
    currenciesAccepted: "KES",
    paymentAccepted: "M-Pesa, Cash",
    areaServed: { "@type": "Country", name: "Kenya" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Farm Inputs",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Seeds" },
        { "@type": "OfferCatalog", name: "Fertilisers" },
        { "@type": "OfferCatalog", name: "Pesticides" },
        { "@type": "OfferCatalog", name: "Veterinary Supplies" },
      ],
    },
  };
}

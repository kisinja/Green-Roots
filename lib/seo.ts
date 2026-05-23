// lib/seo.ts
import { Metadata } from 'next';

export const SITE_NAME = "Mkulima Supply Store";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greenroots-pi.vercel.app";

export function generateBlogMetadata(post: any): Metadata {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage || "/og-image-default.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
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
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.seoKeywords?.join(', ') || post.tags?.join(', '),
  };
}
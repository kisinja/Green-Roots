import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkulimasupply.store'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — allow everything except private routes
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Google — full access
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // OpenAI / ChatGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // OpenAI search
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Perplexity AI
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Anthropic / Claude
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Microsoft Copilot / Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Google AI (Gemini, SGE)
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // You.com
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Meta AI
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/orders/', '/login/', '/register/'],
      },
      // Common AI research crawlers
      {
        userAgent: 'FacebookBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

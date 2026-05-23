// components/blog/BlogHero.tsx
import Image from 'next/image';

export default function BlogHero() {
  return (
    <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-green-900">
      <div className="absolute inset-0 bg-[url('/blog-hero-bg.jpg')] bg-cover bg-center opacity-40" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm mb-6 border border-white/20">
          🌱 Mkulima Supply Knowledge Hub
        </div>
        
        <h1 className="text-6xl md:text-7xl font-playfair text-white leading-tight mb-6">
          Stories from the Soil
        </h1>
        <p className="text-xl text-green-100 max-w-2xl mx-auto">
          Expert insights, practical farming guides, and success stories from Kenyan farmers and agronomists.
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-scroll" />
        </div>
      </div>
    </div>
  );
}
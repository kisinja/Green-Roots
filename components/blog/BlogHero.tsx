// components/blog/BlogHero.tsx
import { BookOpen } from 'lucide-react';
import Furrows from '../layout/furrows';

export default function BlogHero() {
  return (
    <div className="relative bg-[var(--green-900)] px-6 pt-24 pb-0 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl pb-20 text-center">
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-300)]">
          <BookOpen className="h-4 w-4" />
          Mkulima Supply Knowledge Hub
        </p>

        <h1 className="font-display text-5xl leading-tight tracking-tight text-[var(--cream)] sm:text-6xl">
          Stories from the Soil
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/60">
          Expert insights, practical farming guides, and success stories from
          Kenyan farmers and agronomists.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-px">
        <Furrows tone="dark" />
      </div>
    </div>
  );
}
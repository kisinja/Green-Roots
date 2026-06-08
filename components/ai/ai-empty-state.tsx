"use client";

import { AISuggestions } from "./ai-suggestions";

interface Props {
  onSelect: (prompt: string) => void;
}

export function AIEmptyState({ onSelect }: Props) {
  return (
    <div className="space-y-8 text-center">
      <div>
        <h2 className="font-serif text-4xl">Mkulima AI Agronomist</h2>

        <p className="mt-3 text-muted-foreground">
          Ask farming questions, discover products, and get expert advice.
        </p>
      </div>

      <AISuggestions onSelect={onSelect} />
    </div>
  );
}

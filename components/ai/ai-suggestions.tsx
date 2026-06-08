"use client";

const suggestions = [
  "What fertilizer should I use for maize?",
  "Best fungicide for tomatoes?",
  "Show me maize seeds.",
  "Which pesticide controls aphids?",
  "Recommend products for onions.",
  "What causes yellow maize leaves?",
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function AISuggestions({ onSelect }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {suggestions.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-xl border p-3 text-left hover:bg-green-50"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

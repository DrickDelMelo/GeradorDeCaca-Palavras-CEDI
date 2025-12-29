import React from 'react';
import { WordPlacement } from '@/lib/wordSearchGenerator';
import { cn } from '@/lib/utils';

interface WordListProps {
  placements: WordPlacement[];
  className?: string;
}

export const WordList: React.FC<WordListProps> = ({ placements, className }) => {
  // Sort words alphabetically
  const sortedPlacements = [...placements].sort((a, b) => 
    a.word.localeCompare(b.word)
  );

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-lg font-bold text-foreground">Palavras para encontrar:</h3>
      <div className="flex flex-wrap gap-2">
        {sortedPlacements.map((placement, index) => (
          <span
            key={`${placement.word}-${index}`}
            className={cn(
              'word-item',
              placement.found && 'found'
            )}
          >
            {placement.word}
          </span>
        ))}
      </div>
    </div>
  );
};

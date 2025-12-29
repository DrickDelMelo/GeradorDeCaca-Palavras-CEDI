import React from 'react';
import { PuzzleData, getWordCells } from '@/lib/wordSearchGenerator';
import { cn } from '@/lib/utils';

interface WordSearchGridProps {
  puzzle: PuzzleData;
  showAnswers?: boolean;
  className?: string;
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  puzzle,
  showAnswers = false,
  className,
}) => {
  const highlightedCells = new Set<string>();

  if (showAnswers) {
    puzzle.placements.forEach((placement) => {
      const cells = getWordCells(placement);
      cells.forEach(([row, col]) => {
        highlightedCells.add(`${row}-${col}`);
      });
    });
  }

  return (
    <div className={cn('puzzle-grid inline-block', className)}>
      <div
        className="grid gap-0 border-2 border-puzzle-border rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
        }}
      >
        {puzzle.grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isHighlighted = highlightedCells.has(`${rowIndex}-${colIndex}`);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'puzzle-cell',
                  isHighlighted && 'found'
                )}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

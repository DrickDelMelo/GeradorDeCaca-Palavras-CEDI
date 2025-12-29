import React, { useMemo } from 'react';
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
  const highlightedCells = useMemo(() => {
    const cells = new Set<string>();
    if (showAnswers) {
      puzzle.placements.forEach((placement) => {
        const wordCells = getWordCells(placement);
        wordCells.forEach(([row, col]) => {
          cells.add(`${row}-${col}`);
        });
      });
    }
    return cells;
  }, [puzzle.placements, showAnswers]);

  return (
    <div className={cn('puzzle-grid inline-block', className)}>
      <table className="border-collapse border-2 border-puzzle-border rounded-lg overflow-hidden">
        <tbody>
          {puzzle.grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((letter, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isHighlighted = highlightedCells.has(cellKey);
                return (
                  <td
                    key={cellKey}
                    className={cn(
                      'w-8 h-8 text-center text-lg font-bold uppercase select-none',
                      'border border-puzzle-border',
                      'transition-colors duration-200',
                      isHighlighted 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card text-foreground'
                    )}
                  >
                    {letter}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

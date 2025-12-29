export type Direction = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';

export interface WordPlacement {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  found?: boolean;
}

export interface PuzzleData {
  grid: string[][];
  placements: WordPlacement[];
  size: number;
}

const DIRECTIONS: { [key in Direction]: [number, number] } = {
  'horizontal': [0, 1],
  'vertical': [1, 0],
  'diagonal-down': [1, 1],
  'diagonal-up': [-1, 1],
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function normalizeWord(word: string): string {
  return word
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function canPlaceWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction
): boolean {
  const [dRow, dCol] = DIRECTIONS[direction];
  const size = grid.length;

  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;

    if (row < 0 || row >= size || col < 0 || col >= size) {
      return false;
    }

    const currentCell = grid[row][col];
    if (currentCell !== '' && currentCell !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction
): void {
  const [dRow, dCol] = DIRECTIONS[direction];

  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;
    grid[row][col] = word[i];
  }
}

function getRandomDirection(): Direction {
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'];
  return directions[Math.floor(Math.random() * directions.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateWordSearch(words: string[], gridSize: number): PuzzleData {
  const normalizedWords = words
    .map(normalizeWord)
    .filter(w => w.length > 0 && w.length <= gridSize)
    .sort((a, b) => b.length - a.length);

  const grid: string[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(''));

  const placements: WordPlacement[] = [];

  for (const word of normalizedWords) {
    let placed = false;
    const directions = shuffleArray(Object.keys(DIRECTIONS) as Direction[]);

    for (const direction of directions) {
      if (placed) break;

      const [dRow, dCol] = DIRECTIONS[direction];
      const positions: [number, number][] = [];

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const endRow = row + (word.length - 1) * dRow;
          const endCol = col + (word.length - 1) * dCol;

          if (
            endRow >= 0 &&
            endRow < gridSize &&
            endCol >= 0 &&
            endCol < gridSize
          ) {
            positions.push([row, col]);
          }
        }
      }

      const shuffledPositions = shuffleArray(positions);

      for (const [row, col] of shuffledPositions) {
        if (canPlaceWord(grid, word, row, col, direction)) {
          placeWord(grid, word, row, col, direction);
          placements.push({
            word,
            startRow: row,
            startCol: col,
            direction,
            found: false,
          });
          placed = true;
          break;
        }
      }
    }
  }

  // Fill empty cells with random letters
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return { grid, placements, size: gridSize };
}

export function getWordCells(placement: WordPlacement): [number, number][] {
  const [dRow, dCol] = DIRECTIONS[placement.direction];
  const cells: [number, number][] = [];

  for (let i = 0; i < placement.word.length; i++) {
    cells.push([
      placement.startRow + i * dRow,
      placement.startCol + i * dCol,
    ]);
  }

  return cells;
}
